import { NextResponse } from "next/server";
import { z } from "zod";

import { supabaseServer } from "@/lib/supabase-server";

const callbackSchema = z.object({
  leadId: z.string().uuid(),
  status: z.enum(["processing", "sent", "failed"]),
  providerMessageId: z.string().trim().min(1).optional(),
  workflowExecutionId: z.string().trim().min(1).optional(),
  errorCode: z.string().trim().min(1).optional(),
});

type LeadStatus = "pending" | "processing" | "sent" | "failed";

const allowedTransitions: Record<LeadStatus, LeadStatus[]> = {
  pending: ["processing", "failed"],
  processing: ["sent", "failed"],
  sent: [],
  failed: [],
};

export async function POST(request: Request) {
  try {
    const callbackSecret = process.env.N8N_CALLBACK_SECRET;

    if (!callbackSecret) {
      console.error("MISSING_N8N_CALLBACK_SECRET");

      return NextResponse.json(
        {
          success: false,
          error: "SERVER_CONFIGURATION_ERROR",
          message: "Callback authentication is not configured.",
        },
        { status: 500 }
      );
    }

    const incomingSecret = request.headers.get("x-xbot-callback-key");

    if (!incomingSecret || incomingSecret !== callbackSecret) {
      return NextResponse.json(
        {
          success: false,
          error: "UNAUTHORIZED",
          message: "Invalid callback credentials.",
        },
        { status: 401 }
      );
    }

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

    const parsed = callbackSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_FAILED",
          message: "Please check the callback payload.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      leadId,
      status,
      providerMessageId,
      workflowExecutionId,
      errorCode,
    } = parsed.data;

    const { data: existingLead, error: readError } = await supabaseServer
      .from("leads")
      .select("lead_id, response_status")
      .eq("lead_id", leadId)
      .single();

    if (readError || !existingLead) {
      return NextResponse.json(
        {
          success: false,
          error: "LEAD_NOT_FOUND",
          message: "Target lead was not found.",
        },
        { status: 404 }
      );
    }

    const currentStatus = existingLead.response_status as LeadStatus;

    if (!allowedTransitions[currentStatus]?.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_STATE_TRANSITION",
          message: `Transition from ${currentStatus} to ${status} is not allowed.`,
        },
        { status: 409 }
      );
    }

    const updatePayload: {
      response_status: LeadStatus;
      updated_at: string;
      workflow_execution_id?: string;
      provider_message_id?: string;
      response_sent_at?: string;
      error_code?: string;
    } = {
      response_status: status,
      updated_at: new Date().toISOString(),
    };

    if (workflowExecutionId) {
      updatePayload.workflow_execution_id = workflowExecutionId;
    }

    if (status === "sent") {
      if (!providerMessageId) {
        return NextResponse.json(
          {
            success: false,
            error: "VALIDATION_FAILED",
            message: "providerMessageId is required when status is sent.",
          },
          { status: 400 }
        );
      }

      updatePayload.provider_message_id = providerMessageId;
      updatePayload.response_sent_at = new Date().toISOString();
      updatePayload.error_code = undefined;
    }

    if (status === "failed") {
      if (errorCode) {
        updatePayload.error_code = errorCode;
      }
    }

    const { data: updatedLead, error: updateError } = await supabaseServer
      .from("leads")
      .update(updatePayload)
      .eq("lead_id", leadId)
      .eq("response_status", currentStatus)
      .select(
        "lead_id, response_status, workflow_execution_id, provider_message_id, response_sent_at, error_code, updated_at"
      )
      .single();

    if (updateError || !updatedLead) {
      console.error("CALLBACK_UPDATE_FAILED", {
        code: updateError?.code,
        message: updateError?.message,
      });

      return NextResponse.json(
        {
          success: false,
          error: "STATE_UPDATE_FAILED",
          message: "Lifecycle state could not be updated.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Lifecycle state updated.",
        data: updatedLead,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("AUTOMATION_CALLBACK_INTERNAL_ERROR", {
      message: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "We couldn't process the callback right now.",
      },
      { status: 500 }
    );
  }
}
