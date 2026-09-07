# XBOT EV Task 4 — Demo Plan

> **Purpose:** Provide a clear, evidence-driven recording sequence for the XBOT EV Automated Lead Response System.

**Recommended duration:** 60–90 seconds  
**Live Application:** https://xbot-task-4.vercel.app  
**Repository:** https://github.com/Shoaibstat876/xbot-task-4

---

## Recording Goal

The demo should prove that the system is not only a frontend form.

It should demonstrate the full working chain:

```text
XBOT EV Lead Form
→ Next.js API
→ Supabase PostgreSQL
→ n8n Workflow
→ Resend
→ Authenticated Callback
→ Final Persisted State
```

The recording should focus on evidence, not advertising.

---

# Before Recording

Prepare these tabs in advance:

1. Live XBOT EV application
2. Supabase `public.leads` table
3. n8n workflow / executions
4. Test email inbox
5. GitHub repository

Before recording:

- close unrelated personal tabs
- hide environment variable values
- hide API keys
- hide webhook secrets
- hide callback secrets
- hide Resend credentials
- avoid showing private personal information
- make sure the n8n workflow is published
- make sure the production site is the latest deployment
- use a fresh test email / unique lead name

---

# Demo Sequence

## Scene 1 — Live Application

### SCREEN

Open:

```text
https://xbot-task-4.vercel.app
```

Show the final XBOT EV page for a few seconds.

### SHOW

- XBOT EV branding
- product hero image
- enquiry form
- responsive professional UI

### SAY

> “This is the live XBOT EV lead-response system deployed on Vercel. It captures a customer enquiry and automatically processes a personalized email response.”

---

## Scene 2 — Submit a Test Lead

### SCREEN

Enter a clear test lead.

Example:

```text
Name:
XBOT Demo Lead

Email:
your test email

Interest:
I would like more information about XBOT EV and future test-ride availability.
```

Click **Submit**.

### SHOW

The success message:

```text
Your enquiry has been received.
```

### SAY

> “The customer submits their name, email, and stated interest. The backend validates and stores the lead before triggering automation.”

---

## Scene 3 — Prove Database Persistence

### SCREEN

Open Supabase and locate the newly created lead.

### SHOW

Safely highlight:

```text
lead_id
name
email
interest
submission_id
response_status
```

Do not expose private credentials.

### SAY

> “The lead is persisted in Supabase PostgreSQL first, so the enquiry remains available even if a downstream automation service has a problem.”

---

## Scene 4 — Show n8n Execution

### SCREEN

Open the latest n8n production execution.

### SHOW

The workflow:

```text
Webhook
→ Processing Callback
→ Edit Fields
→ Resend
→ Sent Callback
```

Show the successful execution state.

### SAY

> “The Next.js backend securely triggers the published n8n workflow. The workflow records processing, prepares the deterministic personalized email, sends it through Resend, and reports the final status back to the application.”

---

## Scene 5 — Show Personalized Email

### SCREEN

Open the test inbox and show the newly received XBOT EV email.

### SHOW

The message includes:

```text
lead name
stated interest
XBOT EV response
```

### SAY

> “The automated response includes the actual lead name and stated interest, directly satisfying the assessment requirement.”

---

## Scene 6 — Show Final Lifecycle State

### SCREEN

Return to Supabase and show the same lead after completion.

### SHOW

Safely highlight:

```text
response_status = sent
workflow_execution_id = populated
provider_message_id = populated
response_sent_at = populated
error_code = NULL
```

### SAY

> “The final database record gives traceability across the lead, workflow execution, provider operation, and response timestamp.”

---

## Scene 7 — Mention Reliability and Security

### SCREEN

Option A: briefly show the project architecture or GitHub repository.

Option B: briefly show the duplicate-protection test screenshot if convenient.

### SAY

> “The system also includes authenticated webhooks and callbacks, controlled lifecycle transitions, duplicate-submission protection, and truthful handling of uncertain automation outcomes.”

---

## Scene 8 — Final Handover

### SCREEN

Show the GitHub repository.

### SHOW

Important files:

```text
README.md
case-study.md
questions-answers.md
docs/architecture.md
docs/build-vs-reuse.md
```

### SAY

> “The complete source code, architecture, case study, reproduction steps, and engineering documentation are included in the repository.”

---

# Recommended Demo Ending

End with the live application visible.

### SAY

> “The result is a working, production-deployed XBOT EV lead-response system that combines full-stack development, workflow automation, persistent state, security, and production verification.”

---

# What NOT to Show

Do not show:

```text
SUPABASE_SECRET_KEY
N8N_WEBHOOK_SECRET
N8N_CALLBACK_SECRET
Resend API key
full credential values
personal unrelated email
private browser tabs
```

Do not claim:

```text
guaranteed inbox delivery
exactly-once distributed execution
unverified XBOT EV specifications
unverified sales or ROI improvements
```

---

# Final Recording Checklist

Before pressing Record:

- [ ] latest Vercel deployment is live
- [ ] n8n workflow is published
- [ ] test inbox is ready
- [ ] Supabase leads table is open
- [ ] GitHub repository is open
- [ ] secrets are hidden
- [ ] personal tabs are closed
- [ ] fresh test lead is prepared

During recording:

- [ ] show live site
- [ ] submit fresh lead
- [ ] show success message
- [ ] show database row
- [ ] show n8n execution
- [ ] show received personalized email
- [ ] show final `sent` database state
- [ ] mention security and duplicate protection
- [ ] finish on live URL/repository

---

**XBOT EV Task 4 — Working Demo Plan**
