"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

type LeadForm = {
  name: string;
  email: string;
  interest: string;
};

type FieldErrors = {
  name?: string;
  email?: string;
  interest?: string;
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

const INTEREST_LIMIT = 1000;

const KNOWN_FIELDS: (keyof FieldErrors)[] = [
  "name",
  "email",
  "interest",
];

const brandTraits = ["Premium", "Futuristic", "Reliable"];

export default function Home() {
  const [form, setForm] = useState<LeadForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [imageFailed, setImageFailed] = useState(false);

  function updateField(field: keyof LeadForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (fieldErrors[field]) {
      setFieldErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }

    if (message || isError) {
      setMessage("");
      setIsError(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setMessage("");
    setIsError(false);
    setFieldErrors({});

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
        const nextFieldErrors: FieldErrors = {};
        const globalMessages: string[] = [];

        if (data.fieldErrors) {
          for (const [key, messages] of Object.entries(data.fieldErrors)) {
            const firstMessage = messages?.[0];

            if (!firstMessage) {
              continue;
            }

            if (KNOWN_FIELDS.includes(key as keyof FieldErrors)) {
              nextFieldErrors[key as keyof FieldErrors] = firstMessage;
            } else {
              globalMessages.push(firstMessage);
            }
          }
        }

        setFieldErrors(nextFieldErrors);
        setIsError(true);

        const hasInlineErrors =
          Object.keys(nextFieldErrors).length > 0;

        if (globalMessages.length > 0) {
          setMessage(globalMessages.join(" "));
        } else if (!hasInlineErrors) {
          setMessage(
            data.message ||
              "We could not submit your enquiry. Please try again."
          );
        }

        return;
      }

      setForm(initialForm);
      setFieldErrors({});
      setIsError(false);

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
    <main className="min-h-screen overflow-x-hidden bg-[#081B2D] text-white">
      <div className="min-h-screen lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(430px,0.85fr)]">
        {/* ============================================================ */}
        {/* LEFT — XBOT PRODUCT EXPERIENCE                              */}
        {/* ============================================================ */}
        <section
          aria-label="XBOT EV"
          className="relative isolate flex min-h-190 flex-col overflow-hidden bg-[#081B2D] lg:min-h-screen"
        >
          {/* technical grid */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage:
                "linear-gradient(to bottom, black 0%, black 48%, transparent 85%)",
            }}
          />

          {/* ambient cyan lighting */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-44 -bottom-48 h-160 w-160 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(0,212,212,0.17), rgba(24,66,170,0.08) 46%, transparent 72%)",
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 -top-40 h-120 w-120 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(0,212,212,0.10), transparent 68%)",
            }}
          />

          {/* top brand bar */}
          <div className="relative z-30 px-6 pt-8 sm:px-10 sm:pt-10 lg:px-14 lg:pt-12 xl:px-16">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#00D4D4]/40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00D4D4]" />
                </span>

                <span
                  className="text-xs font-semibold uppercase tracking-[0.24em] text-white sm:text-sm"
                  style={{
                    fontFamily: "var(--font-display)",
                  }}
                >
                  XBOT EV
                </span>
              </div>

              <span className="hidden text-[10px] font-medium uppercase tracking-[0.22em] text-[#C8CDD3]/45 sm:block">
                Electric mobility
              </span>
            </div>

            <div className="mt-4 h-px w-full bg-linear-to-r from-[#00D4D4]/55 via-white/10 to-transparent" />
          </div>

          {/* editorial copy */}
          <div className="relative z-30 px-6 pt-7 sm:px-10 lg:px-14 xl:px-16">
            

            <h1
              className="max-w-190 font-semibold tracking-[-0.04em] text-white"
              style={{
                fontFamily: "var(--font-display)",
                lineHeight: 1.03,
              }}
            >
              <span className="block text-[2.35rem] sm:text-[2.9rem] lg:text-[2.8rem] xl:text-[3.45rem] 2xl:text-[3.8rem]">
                Engineered mobility.
              </span>

              <span className="mt-1 block text-[2.35rem] sm:text-[2.9rem] lg:text-[2.8rem] xl:text-[3.45rem] 2xl:text-[3.8rem]">
                Built for what comes next.
              </span>
            </h1>

            <p className="mt-5 max-w-md text-sm leading-6 text-[#C8CDD3] sm:text-base sm:leading-7">
              Share a few details and the XBOT EV team will follow up
              directly with the information you need.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {brandTraits.map((trait) => (
                <span
                  key={trait}
                  className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/70"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* product hero */}
          <div className="relative z-10 mt-4 min-h-97.5 flex-1 sm:min-h-117.5 lg:mt-2 lg:min-h-110">
            {/* subtle product stage */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-10 left-1/2 h-56 w-[72%] -translate-x-1/2 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(0,212,212,0.17), rgba(34,72,190,0.08) 48%, transparent 72%)",
              }}
            />

            {!imageFailed ? (
              <Image
                src="/images/xbot-ev-hero.png"
                alt="XBOT EV electric scooter"
                fill
                priority
                sizes="(min-width: 1440px) 58vw, (min-width: 1024px) 56vw, 100vw"
                className="object-contain object-bottom px-4 pb-2 sm:px-8 lg:px-6 xl:px-10"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(72% 62% at 50% 100%, rgba(0,212,212,0.14), rgba(31,72,190,0.07) 46%, transparent 72%)",
                }}
              />
            )}

            {/* fade vehicle into page */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-28"
              style={{
                background:
                  "linear-gradient(to bottom, #081B2D 0%, rgba(8,27,45,0.74) 38%, transparent 100%)",
              }}
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
              style={{
                background:
                  "linear-gradient(to top, rgba(8,27,45,0.55), transparent)",
              }}
            />

            {/* product caption */}
            <div className="absolute bottom-6 left-6 z-20 hidden items-center gap-3 sm:flex lg:left-14 xl:left-16">
              <span className="h-px w-8 bg-[#00D4D4]" />

              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/45">
                XBOT EV
              </span>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* RIGHT — ENQUIRY EXPERIENCE                                   */}
        {/* ============================================================ */}
        <section className="relative flex min-h-screen items-center justify-center border-t border-white/10 bg-[#091521] px-6 py-12 sm:px-10 lg:border-l lg:border-t-0 lg:px-10 xl:px-14">
          {/* right-side background details */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.018) 1px, transparent 1px)",
              backgroundSize: "68px 68px",
              opacity: 0.5,
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 -top-44 h-96 w-96 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(0,212,212,0.07), transparent 68%)",
            }}
          />

          {/* precision rail */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[12%] left-0 top-[12%] hidden w-px lg:block"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(0,212,212,0.72) 20%, rgba(200,205,211,0.22) 50%, rgba(0,212,212,0.72) 80%, transparent)",
            }}
          >
            <span className="absolute left-1/2 top-1/4 h-2 w-2 -translate-x-1/2 rounded-full border border-[#00D4D4]/50 bg-[#091521]" />
            <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C8CDD3]/55" />
            <span className="absolute bottom-1/4 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full border border-[#00D4D4]/50 bg-[#091521]" />
          </div>

          <div className="relative z-10 w-full max-w-115">
            {/* form intro */}
            <div className="mb-7">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-[#00D4D4]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#00D4D4]">
                  Enquiry console
                </span>
              </div>

              <h2
                className="max-w-sm text-2xl font-semibold tracking-tight text-white sm:text-[1.85rem]"
                style={{
                  fontFamily: "var(--font-display)",
                }}
              >
                Start a conversation with XBOT EV.
              </h2>

              <p className="mt-3 max-w-sm text-sm leading-6 text-[#C8CDD3]/70">
                Tell us what you&apos;re interested in and the team will
                receive your enquiry for follow-up.
              </p>
            </div>

            {/* enquiry panel */}
            <form
              onSubmit={handleSubmit}
              aria-busy={isSubmitting}
              className="relative rounded-[22px] border border-white/10 bg-[#0D1B27] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.16)] sm:p-7"
            >
              {/* precision top accent */}
              <div
                aria-hidden="true"
                className="absolute left-6 right-6 top-0 h-px"
                style={{
                  background:
                    "linear-gradient(to right, transparent, #00D4D4 35%, #00D4D4 65%, transparent)",
                }}
              />

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-white/80"
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
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    placeholder="Your full name"
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={
                      fieldErrors.name ? "name-error" : undefined
                    }
                    className={`w-full rounded-xl border bg-[#07131E] px-4 py-3.5 text-base text-white placeholder:text-white/30 outline-none transition duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
                      fieldErrors.name
                        ? "border-red-400/60 focus:border-red-400 focus:ring-2 focus:ring-red-400/25"
                        : "border-white/10 hover:border-white/20 focus:border-[#00D4D4] focus:ring-2 focus:ring-[#00D4D4]/20"
                    }`}
                  />

                  {fieldErrors.name && (
                    <p
                      id="name-error"
                      role="alert"
                      className="mt-1.5 text-xs text-red-300"
                    >
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-white/80"
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
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="you@example.com"
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={
                      fieldErrors.email ? "email-error" : undefined
                    }
                    className={`w-full rounded-xl border bg-[#07131E] px-4 py-3.5 text-base text-white placeholder:text-white/30 outline-none transition duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
                      fieldErrors.email
                        ? "border-red-400/60 focus:border-red-400 focus:ring-2 focus:ring-red-400/25"
                        : "border-white/10 hover:border-white/20 focus:border-[#00D4D4] focus:ring-2 focus:ring-[#00D4D4]/20"
                    }`}
                  />

                  {fieldErrors.email && (
                    <p
                      id="email-error"
                      role="alert"
                      className="mt-1.5 text-xs text-red-300"
                    >
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Interest */}
                <div>
                  <div className="mb-2 flex items-baseline justify-between gap-3">
                    <label
                      htmlFor="interest"
                      className="text-sm font-medium text-white/80"
                    >
                      Interest
                    </label>

                    <span
                      id="interest-counter"
                      className="text-xs tabular-nums text-white/35"
                    >
                      {form.interest.length}/{INTEREST_LIMIT}
                    </span>
                  </div>

                  <textarea
                    id="interest"
                    name="interest"
                    rows={5}
                    required
                    maxLength={INTEREST_LIMIT}
                    disabled={isSubmitting}
                    value={form.interest}
                    onChange={(event) =>
                      updateField("interest", event.target.value)
                    }
                    placeholder="What would you like to know about XBOT EV?"
                    aria-invalid={Boolean(fieldErrors.interest)}
                    aria-describedby={
                      fieldErrors.interest
                        ? "interest-counter interest-error"
                        : "interest-counter"
                    }
                    className={`w-full resize-none rounded-xl border bg-[#07131E] px-4 py-3.5 text-base leading-6 text-white placeholder:text-white/30 outline-none transition duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
                      fieldErrors.interest
                        ? "border-red-400/60 focus:border-red-400 focus:ring-2 focus:ring-red-400/25"
                        : "border-white/10 hover:border-white/20 focus:border-[#00D4D4] focus:ring-2 focus:ring-[#00D4D4]/20"
                    }`}
                  />

                  {fieldErrors.interest && (
                    <p
                      id="interest-error"
                      role="alert"
                      className="mt-1.5 text-xs text-red-300"
                    >
                      {fieldErrors.interest}
                    </p>
                  )}
                </div>

                {/* CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00D4D4] px-5 py-3.5 text-base font-semibold text-[#081B2D] transition duration-150 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4D4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1B27] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting && (
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="3"
                        opacity="0.25"
                      />

                      <path
                        d="M21 12a9 9 0 0 0-9-9"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}

                  {isSubmitting
                    ? "Sending enquiry..."
                    : "Send Enquiry"}
                </button>

                {/* status */}
                {message && (
                  <div
                    role={isError ? "alert" : "status"}
                    aria-live="polite"
                    className={`rounded-xl border px-4 py-3 text-sm leading-6 ${
                      isError
                        ? "border-red-400/25 bg-red-400/10 text-red-200"
                        : "border-[#00D4D4]/25 bg-[#00D4D4]/10 text-[#8CF4F4]"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 pt-1 text-xs leading-5 text-white/35">
                  <span className="h-1 w-1 shrink-0 rounded-full bg-[#00D4D4]/70" />

                  <span className="text-center">
                    Your details are used only to respond to your XBOT EV
                    enquiry.
                  </span>
                </div>
              </div>
            </form>

            <div className="mt-5 flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.18em] text-white/25">
              <span>XBOT EV</span>
              <span className="h-px w-6 bg-white/15" />
              <span>Direct enquiry</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}