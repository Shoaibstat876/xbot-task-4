"use client";

import { FormEvent, useState } from "react";

type LeadForm = {
  name: string;
  email: string;
  interest: string;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  leadId?: string;
  status?: string;
  fieldErrors?: Record<string, string[]>;
};

const initialForm: LeadForm = {
  name: "",
  email: "",
  interest: "",
};

export default function Home() {
  const [form, setForm] = useState<LeadForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  function updateField(field: keyof LeadForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          interest: form.interest.trim(),
        }),
      });

      let data: ApiResponse = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        const validationMessage = data.fieldErrors
          ? Object.values(data.fieldErrors).flat().join(" ")
          : "";

        throw new Error(
          validationMessage ||
            data.message ||
            "We could not submit your enquiry. Please try again."
        );
      }

      setForm(initialForm);

      setMessage(
        data.message ||
          "Your enquiry has been received. The XBOT EV team will follow up."
      );
    } catch (error) {
      setIsError(true);

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#081B2D] px-4 py-10 text-white sm:px-6 sm:py-14">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full bg-[#00D4D4]"
            />

            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#00D4D4]">
              XBOT EV
            </p>
          </div>

          <h1 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Tell us what you&apos;re interested in
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 text-[#C8CDD3]">
            Submit your enquiry and the XBOT EV team will receive your details
            for follow-up.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-white/10 bg-white/4.5 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-8"
        >
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-white"
            >
              Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              maxLength={100}
              disabled={isSubmitting}
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              className="w-full rounded-xl border border-white/15 bg-[#181E24] px-4 py-3.5 text-white placeholder:text-white/35 outline-none transition focus:border-[#00D4D4] focus:ring-2 focus:ring-[#00D4D4]/15 disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-white"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              disabled={isSubmitting}
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              className="w-full rounded-xl border border-white/15 bg-[#181E24] px-4 py-3.5 text-white placeholder:text-white/35 outline-none transition focus:border-[#00D4D4] focus:ring-2 focus:ring-[#00D4D4]/15 disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-4">
              <label
                htmlFor="interest"
                className="block text-sm font-medium text-white"
              >
                Interest
              </label>

              <span className="text-xs text-white/40">
                {form.interest.length}/1000
              </span>
            </div>

            <textarea
              id="interest"
              name="interest"
              rows={5}
              required
              maxLength={1000}
              disabled={isSubmitting}
              value={form.interest}
              onChange={(event) => updateField("interest", event.target.value)}
              className="w-full resize-none rounded-xl border border-white/15 bg-[#181E24] px-4 py-3.5 text-white placeholder:text-white/35 outline-none transition focus:border-[#00D4D4] focus:ring-2 focus:ring-[#00D4D4]/15 disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="What would you like to know about XBOT EV?"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded-xl bg-[#00D4D4] px-5 py-3.5 font-semibold text-[#081B2D] transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#00D4D4] focus:ring-offset-2 focus:ring-offset-[#081B2D] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Sending enquiry..." : "Send Enquiry"}
          </button>

          {message && (
            <div
              role="status"
              aria-live="polite"
              className={`rounded-xl border px-4 py-3 text-sm leading-6 ${
                isError
                  ? "border-red-400/20 bg-red-400/10 text-red-200"
                  : "border-[#00D4D4]/20 bg-[#00D4D4]/10 text-[#8CF4F4]"
              }`}
            >
              {message}
            </div>
          )}

          <p className="text-center text-xs leading-5 text-white/40">
            Your details are used only to respond to your XBOT EV enquiry.
          </p>
        </form>
      </div>
    </main>
  );
}