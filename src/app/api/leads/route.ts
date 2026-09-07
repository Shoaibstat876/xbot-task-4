import { NextResponse } from "next/server";
import { z } from "zod";

import { supabaseServer } from "@/lib/supabase-server";

const leadSchema = z.object({
  name: z.preprocess(
    (value) => (value === undefined || value === null ? "" : value),
    z
      .string()
      .trim()
      .min(1, "Name is required.")
      .max(100, "Name is too long.")
  ),

  email: z.preprocess(
    (value) => (value === undefined || value === null ? "" : value),
    z
      .string()
      .trim()
      .superRefine((value, ctx) => {
        if (value.length === 0) {
          ctx.addIssue({
            code: "custom",
            message: "Email is required.",
          });
          return;
        }

        if (value.length > 254) {
          ctx.addIssue({
            code: "custom",
            message: "Email address is too long.",
          });
          return;
        }

        if (!z.string().email().safeParse(value).success) {
          ctx.addIssue({
            code: "custom",
            message: "A valid email address is required.",
          });
        }
      })
  ),

  submissionId: z.string().uuid("Invalid submission ID."),
  interest: z.preprocess(
    (value) => (value === undefined || value === null ? "" : value),
    z
      .string()
      .trim()
      .min(1, "Interest is required.")
      .max(1000, "Interest is too long.")
  ),
});

type AutomationResult =
  | {
      status: "accepted";
    }
  | {
      status: "rejected";
      errorCode: string;
    }
  | {
      status: "unknown";
      errorCode: string;
    };

async function triggerAutomation(payload: {
  leadId: string;
  name: string;
  email: string;
  interest: string;
}): Promise<AutomationResult> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    console.error("AUTOMATION_CONFIGURATION_MISSING");

    return {
      status: "rejected",
      errorCode: "AUTOMATION_CONFIGURATION_MISSING",
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-xbot-automation-key": webhookSecret,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: "no-store",
    });

    if (response.ok) {
      return {
        status: "accepted",
      };
    }

    if (response.status >= 400 && response.status < 500) {
      console.error("AUTOMATION_TRIGGER_REJECTED", {
        status: response.status,
      });

      return {
        status: "rejected",
        errorCode: "AUTOMATION_TRIGGER_REJECTED",
      };
    }

    console.error("AUTOMATION_TRIGGER_OUTCOME_UNKNOWN", {
      status: response.status,
    });

    return {
      status: "unknown",
      errorCode: "AUTOMATION_TRIGGER_OUTCOME_UNKNOWN",
    };
  } catch (error) {
    console.error("AUTOMATION_TRIGGER_OUTCOME_UNKNOWN", {
      message: error instanceof Error ? error.message : "Unknown error",
    });

    return {
      status: "unknown",
      errorCode: "AUTOMATION_TRIGGER_OUTCOME_UNKNOWN",
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_FAILED",
          message: "Invalid request payload.",
        },
        { status: 400 }
      );
    }

    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_FAILED",
          message: "Please check the submitted information.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, interest, submissionId } = parsed.data;

    const { data, error } = await supabaseServer
      .from("leads")
      .insert({
        name,
        email,
        interest,
        submission_id: submissionId,
        response_status: "pending",
      })
      .select("lead_id, response_status, created_at")
      .single();

      if (error?.code === "23505") {
  const { data: existingLead } = await supabaseServer
    .from("leads")
    .select("lead_id, response_status")
    .eq("submission_id", submissionId)
    .maybeSingle();

  return NextResponse.json(
    {
      success: true,
      leadId: existingLead?.lead_id,
      status: existingLead?.response_status,
      duplicate: true,
      message: "Your enquiry has already been received.",
    },
    { status: 200 }
  );
}
    if (error || !data) {
      console.error("DATABASE_INSERT_FAILED", {
        code: error?.code,
        message: error?.message,
      });

      return NextResponse.json(
        {
          success: false,
          error: "DATABASE_INSERT_FAILED",
          message: "We couldn't save your enquiry right now.",
        },
        { status: 500 }
      );
    }

    const automationResult = await triggerAutomation({
      leadId: data.lead_id,
      name,
      email,
      interest,
    });

    if (automationResult.status === "rejected") {
      const { error: lifecycleError } = await supabaseServer
        .from("leads")
        .update({
          response_status: "failed",
          error_code: automationResult.errorCode,
          updated_at: new Date().toISOString(),
        })
        .eq("lead_id", data.lead_id)
        .eq("response_status", "pending");

      if (lifecycleError) {
        console.error("AUTOMATION_FAILURE_STATE_UPDATE_FAILED", {
          code: lifecycleError.code,
          message: lifecycleError.message,
        });
      }
    }

    if (automationResult.status === "unknown") {
      const { error: diagnosticError } = await supabaseServer
        .from("leads")
        .update({
          error_code: automationResult.errorCode,
          updated_at: new Date().toISOString(),
        })
        .eq("lead_id", data.lead_id)
        .eq("response_status", "pending");

      if (diagnosticError) {
        console.error("AUTOMATION_DIAGNOSTIC_UPDATE_FAILED", {
          code: diagnosticError.code,
          message: diagnosticError.message,
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        leadId: data.lead_id,
        status:
          automationResult.status === "rejected"
            ? "failed"
            : data.response_status,
        automationStatus: automationResult.status,
        message: "Your enquiry has been received.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("INTERNAL_SERVER_ERROR", {
      message: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "We couldn't process your request right now.",
      },
      { status: 500 }
    );
  }
}