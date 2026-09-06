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

  interest: z.preprocess(
    (value) => (value === undefined || value === null ? "" : value),
    z
      .string()
      .trim()
      .min(1, "Interest is required.")
      .max(1000, "Interest is too long.")
  ),
});

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

    const { name, email, interest } = parsed.data;

    const { data, error } = await supabaseServer
      .from("leads")
      .insert({
        name,
        email,
        interest,
        response_status: "pending",
      })
      .select("lead_id, response_status, created_at")
      .single();

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

    return NextResponse.json(
      {
        success: true,
        leadId: data.lead_id,
        status: data.response_status,
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