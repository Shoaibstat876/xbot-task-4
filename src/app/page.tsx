"use client";

import { FormEvent, useState } from "react";

type LeadForm = {
  name: string;
  email: string;
  interest: string;
};

export default function Home() {
  const [form, setForm] = useState<LeadForm>({
    name: "",
    email: "",
    interest: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setMessage("");

    // Phase 5 only.
    // The real backend/API connection will be added in Phase 6.
    await new Promise((resolve) => setTimeout(resolve, 500));

    setMessage(
      "Form interaction verified. Backend connection will be added in the next implementation phase."
    );

    setIsSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-[#081B2D] px-6 py-12 text-white">
      <div className="mx-auto max-w-xl">
        <header className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#00D4D4]">
            XBOT EV
          </p>

          <h1 className="text-4xl font-semibold tracking-tight">
            Tell us what you&apos;re interested in
          </h1>

          <p className="mt-4 leading-7 text-[#C8CDD3]">
            Submit your enquiry and the XBOT EV team will receive your details
            for follow-up.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6"
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
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-white/15 bg-[#181E24] px-4 py-3 text-white outline-none transition focus:border-[#00D4D4]"
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
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-white/15 bg-[#181E24] px-4 py-3 text-white outline-none transition focus:border-[#00D4D4]"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              htmlFor="interest"
              className="mb-2 block text-sm font-medium text-white"
            >
              Interest
            </label>

            <textarea
              id="interest"
              name="interest"
              rows={4}
              required
              value={form.interest}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  interest: event.target.value,
                }))
              }
              className="w-full resize-none rounded-lg border border-white/15 bg-[#181E24] px-4 py-3 text-white outline-none transition focus:border-[#00D4D4]"
              placeholder="What would you like to know about XBOT EV?"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[#00D4D4] px-5 py-3 font-semibold text-[#081B2D] transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : "Send Enquiry"}
          </button>

          {message && (
            <p
              role="status"
              aria-live="polite"
              className="text-sm leading-6 text-[#C8CDD3]"
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}