# XBOT EV Task 4 — Video Narration Script

> **Recommended duration:** 60–90 seconds  
> Use this while recording the XBOT EV Task 4 working demo.

---

## Opening

> “This is my XBOT EV Task 4 solution — a production-deployed automated lead-response system built with Next.js, Supabase, n8n, Resend, and Vercel.”

---

## Live Application

> “The customer starts on the XBOT EV enquiry page and submits their name, email, and stated interest.”

---

## Submission

> “When the form is submitted, the Next.js backend validates the request with Zod and persists the lead in Supabase PostgreSQL before triggering any external automation.”

---

## Why Persistence Matters

> “Persisting first means the customer enquiry is not lost just because an external workflow service becomes temporarily unavailable.”

---

## n8n Automation

> “The backend then securely triggers the published n8n production workflow. The workflow sends a processing callback, prepares a deterministic personalized response, and sends the email through Resend.”

---

## Personalized Email

> “The message includes the actual lead name and stated interest, which directly satisfies the assessment requirement.”

---

## Lifecycle and Traceability

> “After the provider accepts the send request, n8n calls the application again. The final database record is updated to sent and stores the n8n workflow execution ID, Resend provider message ID, and response timestamp.”

---

## Reliability and Security

> “The system also includes authenticated server-to-n8n communication, authenticated callbacks, controlled lifecycle transitions, database-level duplicate protection, and separate handling for confirmed failures and uncertain external outcomes.”

---

## Engineering Judgment

> “I deliberately used deterministic automation rather than adding an unnecessary LLM, because the required personalization is predictable, testable, and safer without generative AI.”

---

## Closing

> “The final result is more than a form-to-email demo. It is a working, production-deployed lead-response system with persistent state, workflow traceability, security controls, duplicate protection, and complete technical documentation.”

> “The live application and full source code are included in the submission.”

---

# Optional 60-Second Condensed Version

> “This is my XBOT EV Task 4 solution, a production-deployed automated lead-response system. A customer submits their name, email, and interest through the live Next.js application. The backend validates the request using Zod and stores the lead in Supabase before securely triggering n8n. n8n records the processing state, prepares a deterministic personalized email using the customer's name and stated interest, and sends it through Resend. After provider acceptance, an authenticated callback updates the lead to sent and stores the workflow execution ID, provider message ID, and response timestamp. The system also includes duplicate protection, secure secret boundaries, controlled lifecycle transitions, and truthful handling of uncertain outcomes. I deliberately avoided unnecessary AI because deterministic logic was the safer and more appropriate solution. The result is a working full-stack automation system rather than only a form-to-email demo.”

---

# Speaking Tips

- Speak slowly and naturally.
- Do not read every technical field aloud.
- Let the evidence on screen support what you say.
- Avoid exaggerated claims such as “guaranteed delivery.”
- Say “provider accepted the send request” when discussing `sent`.
- Keep the full recording under roughly 90 seconds unless the evaluator benefits from a longer walkthrough.
- Do not show secrets while narrating.

---

**XBOT EV Task 4 — Video Narration Script**
