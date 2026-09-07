# XBOT EV — Automated Lead Response System

**Production-deployed full-stack lead capture and email automation system**

**Live Application:** https://xbot-task-4.vercel.app  
**Source Repository:** https://github.com/Shoaibstat876/xbot-task-4  
**Primary Branch:** `main`  
**Application:** XBOT EV Lead Response Automation  
**Frontend / Backend:** Next.js 16 + React + TypeScript  
**Database:** Supabase PostgreSQL  
**Automation:** n8n Cloud  
**Email Provider:** Resend  
**Deployment:** Vercel  

## 1. Project Overview

XBOT EV is a working lead-response automation system created for the XBOT EV technical assessment.

The assessment required a small working automation that accepts a test lead and automatically replies through WhatsApp or email while including the lead's name and stated interest.

The implementation uses email as the response channel.

The completed solution does considerably more than connect a form directly to an email API. It provides a complete application flow in which a lead is validated on the server, persisted in PostgreSQL, assigned an observable lifecycle state, passed securely to an authenticated n8n workflow, acknowledged with a deterministic personalized email through Resend, and synchronized back to the application through authenticated lifecycle callbacks.

The system also includes duplicate-submission protection, controlled state transitions, diagnostic handling for uncertain external outcomes, secure credential boundaries, production deployment, responsive user experience, build/lint verification, negative API testing, and end-to-end production evidence.

The complete business and technical flow is:

```text
Visitor opens XBOT EV application
        ↓
Completes Name + Email + Interest
        ↓
Browser creates a logical submission UUID
        ↓
POST /api/leads
        ↓
Next.js performs authoritative Zod validation
        ↓
Valid lead is persisted in Supabase PostgreSQL
        ↓
response_status = pending
        ↓
Next.js securely triggers published n8n webhook
        ↓
n8n sends authenticated processing callback
        ↓
response_status = processing
workflow_execution_id = recorded
        ↓
n8n prepares deterministic personalized email
        ↓
Resend accepts transactional email request
        ↓
n8n sends authenticated sent callback
        ↓
response_status = sent
provider_message_id = recorded
response_sent_at = recorded
        ↓
Lead lifecycle is traceable in PostgreSQL
```

The key design principle is:

```text
Capture
→ Validate
→ Persist
→ Authenticate
→ Automate
→ Respond
→ Synchronize
→ Verify
```

The application therefore treats the lead record as durable business data rather than allowing the external automation platform to become the only source of truth.

## 2. Assessment Requirement and Delivered Result

The required automation had to:

- accept a test lead
- automatically respond by WhatsApp or email
- include the lead's name
- include the lead's stated interest
- provide a working demonstration
- be understandable and reproducible

This implementation satisfies the requirement through the following production architecture:

| Requirement | Implementation |
|---|---|
| Lead capture | Responsive XBOT EV enquiry form |
| Name capture | `name` form field |
| Email capture | `email` form field |
| Stated interest | `interest` textarea |
| Server validation | Zod |
| Persistent storage | Supabase PostgreSQL |
| Automation | Published n8n Cloud workflow |
| Automated response | Resend transactional email |
| Name personalization | Deterministic template |
| Interest personalization | Deterministic template |
| Production hosting | Vercel |
| Automation traceability | `workflow_execution_id` |
| Provider traceability | `provider_message_id` |
| Lifecycle tracking | `pending`, `processing`, `sent`, `failed` |
| Duplicate protection | UUID `submission_id` + PostgreSQL unique index |
| Callback protection | Dedicated authentication secret |
| Error semantics | Known failure vs unknown outcome |
| Responsive UX | Desktop and mobile verified |
| Source code | Public GitHub repository |

The result is intentionally small enough for the assessment while still demonstrating real full-stack and automation engineering.

## 3. Technology Selection

The technology stack is deliberately focused.

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 16 | Frontend and secure server endpoints in one application |
| UI | React | Interactive enquiry experience |
| Language | TypeScript | Type-safe application development |
| Styling | Tailwind CSS | Responsive application styling |
| Validation | Zod | Authoritative server-side request validation |
| Database | Supabase PostgreSQL | Durable lead and lifecycle persistence |
| Automation | n8n Cloud | Visible and inspectable workflow orchestration |
| Email | Resend | Transactional email transport |
| Hosting | Vercel | Production deployment and environment configuration |
| Source Control | Git | Version history |
| Repository | GitHub | Source-code handover |

A separate Python/FastAPI service, microservices, Kafka, Redis, vector database, RAG system, AI agent, or LLM was deliberately not added.

Those technologies would increase operational complexity without improving the verified requirement.

The smallest complete architecture is preferable to unnecessary infrastructure.

### Why Next.js

Next.js provides both the customer-facing React application and trusted server-side API routes inside one deployable project.

This allows the application to implement:

```text
frontend experience
+
server validation
+
database access
+
automation authentication
+
callback authorization
```

without maintaining a separate backend service.

### Why Supabase PostgreSQL

The lead must continue to exist after the browser closes.

Browser memory, `localStorage`, mock arrays, or hardcoded JSON would not provide trustworthy persistence.

Supabase PostgreSQL provides a durable record containing the original lead and downstream automation state.

### Why n8n

n8n makes the automation observable and demonstrable.

The evaluator can understand:

```text
what triggered the workflow
→ what processing occurred
→ what message was sent
→ what callback completed the lifecycle
```

without the workflow being hidden entirely inside backend code.

### Why Resend

Resend provides a focused transactional email API and returns a provider message identifier that can be stored for traceability.

### Why no LLM was added

The response requirement is deterministic.

The system already knows:

```text
lead name
lead email
lead stated interest
approved response structure
```

An LLM would introduce additional:

- latency
- cost
- variability
- hallucination risk
- prompt-injection surface
- dependency risk
- failure modes
- testing complexity

without solving a problem that requires generation.

The deterministic approach is therefore an intentional engineering choice rather than a missing AI feature.

## 4. XBOT EV User Experience

The application was designed specifically for XBOT EV rather than using a generic contact-form appearance.

The primary visual direction is:

```text
Midnight Navy   #081B2D
Electric Cyan   #00D4D4
Titanium        #C8CDD3
Graphite        dark supporting neutral
White           primary contrast
```

Typography uses:

```text
Space Grotesk → display/headline typography
Inter          → body/interface typography
```

The visual identity is built around the attributes:

```text
Premium
Futuristic
Reliable
```

The main XBOT EV product visual is stored at:

```text
/public/images/xbot-ev-hero.png
```

and is rendered through Next.js Image handling.

The interface includes a strong vehicle-focused hero section and a dedicated enquiry area rather than presenting the user with an isolated technical form.

The lead form asks only for information required by the workflow:

```text
Name
Email
Interest
```

Current browser constraints include:

```text
Name      → required, maximum 100 characters
Email     → required, HTML email input, maximum 254 characters
Interest  → required, maximum 1000 characters
```

The interest field includes a visible character counter.

The frontend also provides:

- accessible labels
- `autocomplete` metadata
- inline validation feedback
- `aria-invalid`
- error descriptions
- disabled controls while a submission is active
- loading/submitting feedback
- safe success feedback
- error feedback
- responsive stacking
- keyboard-focus treatment
- mobile-compatible sizing

The user-facing success message deliberately confirms receipt rather than falsely claiming email delivery.

Example:

```text
Your enquiry has been received.
```

That distinction is important because successful lead acceptance and successful provider delivery are different lifecycle events.

### Content governance

No unverified XBOT EV specification is presented as fact.

The interface avoids unsupported claims about:

- vehicle price
- top speed
- range
- battery specification
- battery capacity
- charging duration
- charging performance
- acceleration
- performance figures

The project therefore does not invent commercial information simply to make the landing page appear more complete.

## 5. Frontend Submission Lifecycle

The React application maintains the visible form state:

```ts
type LeadForm = {
  name: string;
  email: string;
  interest: string;
};
```

A logical submission also receives a UUID:

```text
submissionId
```

The browser sends a payload shaped like:

```json
{
  "name": "Example User",
  "email": "user@example.com",
  "interest": "I would like more information about XBOT EV.",
  "submissionId": "550e8400-e29b-41d4-a716-446655440000"
}
```

to:

```http
POST /api/leads
```

The submission UUID exists for idempotency.

It is not the same identifier as the database lead ID.

The identifiers have intentionally separate meanings:

```text
submission_id
= one logical client submission

lead_id
= one persisted database lead

workflow_execution_id
= one downstream n8n execution

provider_message_id
= one provider send operation
```

An email address is not used as an idempotency key because the same customer may legitimately submit another enquiry later.

While the current submission attempt remains unresolved, the frontend retains the same logical submission UUID.

After a successful response, the form is cleared and a new UUID is generated for the next genuine enquiry.

This means a retry of one logical submission can be identified as the same request, while a later genuine enquiry remains a new request.

The form also disables controls while the current request is being processed, reducing accidental rapid repeat clicks.

Database-level uniqueness remains the final authority even if frontend protection is bypassed.

## 6. Trusted Server Boundary

The browser is treated as untrusted.

Its responsibilities are limited to:

```text
rendering
collecting input
showing helpful feedback
managing temporary UI state
sending the request
```

Trusted operations belong to the Next.js server:

```text
authoritative validation
database access
privileged credentials
lead persistence
automation authentication
workflow triggering
lifecycle authorization
callback validation
conditional state mutation
safe client responses
```

The browser never needs access to:

```text
SUPABASE_SECRET_KEY
N8N_WEBHOOK_SECRET
N8N_CALLBACK_SECRET
Resend API key
```

## 7. `POST /api/leads` — Complete Lead Intake Process

The lead endpoint is the trusted entry point for a new enquiry.

Its logical execution order is:

```text
Incoming request
      ↓
Parse JSON
      ↓
Validate with Zod
      ↓
Attempt database insertion
      ↓
Handle duplicate submission if necessary
      ↓
Persist accepted lead as pending
      ↓
Attempt authenticated n8n trigger
      ↓
Classify trigger result
      ↓
Return safe application response
```

### Authoritative validation

The server validates:

```text
name
email
interest
submissionId
```

The `submissionId` must be a valid UUID.

A browser can modify HTML, disable browser validation, or call the endpoint directly, so browser constraints are not accepted as the authoritative security layer.

Invalid API input is rejected server-side.

### Persist before automation

After validation, the application stores the lead before attempting the external workflow.

This order is deliberate:

```text
VALIDATE
   ↓
PERSIST
   ↓
AUTOMATE
```

rather than:

```text
VALIDATE
   ↓
AUTOMATE
   ↓
PERSIST LATER
```

The benefit is:

```text
external automation problem
does not automatically equal
lost customer enquiry
```

A valid lead can remain visible and diagnosable even if n8n is temporarily unavailable.

## 8. Supabase PostgreSQL Data Model

The primary table is:

```text
public.leads
```

The current logical model contains:

| Column | Purpose |
|---|---|
| `lead_id` | Unique persisted lead identifier |
| `name` | Lead name |
| `email` | Lead email |
| `interest` | Stated lead interest |
| `submission_id` | Logical submission UUID used for idempotency |
| `response_status` | Current lifecycle status |
| `created_at` | Lead creation timestamp |
| `updated_at` | Record update timestamp |
| `workflow_execution_id` | n8n execution trace |
| `response_sent_at` | Provider-accepted response timestamp |
| `error_code` | Safe operational diagnostic |
| `provider_message_id` | Resend provider operation ID |

The canonical lifecycle values are:

```text
pending
processing
sent
failed
```

A representative reproduction schema is:

```sql
create extension if not exists pgcrypto;

create table if not exists public.leads (
  lead_id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  interest text not null,
  response_status text not null default 'pending'
    check (response_status in ('pending', 'processing', 'sent', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  submission_id uuid,
  workflow_execution_id text,
  response_sent_at timestamptz,
  error_code text,
  provider_message_id text
);
```

The duplicate-protection index is:

```sql
create unique index if not exists leads_submission_id_unique
on public.leads (submission_id)
where submission_id is not null;
```

The partial condition:

```sql
where submission_id is not null
```

allows older rows without a submission UUID to remain valid while ensuring populated submission IDs cannot be repeated.

Privileged database operations occur through server-side Supabase access.

The application does not expose its privileged Supabase credential to the browser.

## 9. Lifecycle Meaning

A newly persisted lead starts as:

```text
pending
```

This means:

> The lead exists in trusted server-side storage, but downstream processing has not yet been confirmed as completed.

Once n8n begins the authenticated workflow and reports processing, the application moves the record to:

```text
processing
```

After Resend accepts the email send request and n8n reports the provider result, the application moves the record to:

```text
sent
```

A sufficiently established processing or trigger failure can use:

```text
failed
```

The normal lifecycle is:

```text
pending
   ↓
processing
   ↓
sent
```

Supported failure transitions are:

```text
pending → failed
processing → failed
```

In the current callback implementation, `sent` and `failed` are terminal states.

They cannot simply be moved backward by a later callback.

## 10. Authenticated Application-to-n8n Trigger

After persistence, Next.js calls the published n8n production webhook.

The request is server-to-server:

```text
Browser
   ↓
Next.js
   ↓  private authentication
n8n
```

and not:

```text
Browser
   ↓
n8n privileged webhook
```

The application uses:

```text
N8N_WEBHOOK_URL
N8N_WEBHOOK_SECRET
```

The private request header is:

```text
x-xbot-automation-key
```

with the expected value coming from:

```text
N8N_WEBHOOK_SECRET
```

The deployed application uses the **production n8n webhook**, not the temporary test listener.

The current production webhook path is based on:

```text
/webhook/xbot-ev-lead
```

whereas n8n's manual editor testing uses a different `/webhook-test/` path.

This distinction matters operationally.

When testing the published application, the workflow should be published and the application should call the production webhook directly.

There is no need to click n8n's manual **Execute Workflow** button for a normal production submission.

## 11. Trigger Timeout and Outcome Classification

The Next.js trigger request uses an approximately eight-second timeout.

The application does not classify every communication problem as a confirmed automation failure.

Instead, trigger results are divided into:

```text
accepted
rejected
unknown
```

### Accepted

A successful n8n response means the trigger request was accepted according to the observed interaction.

The API can report:

```text
automationStatus = accepted
```

### Definite rejection

A definite configuration/client rejection can be represented as a known failure.

Examples include:

```text
required automation configuration missing
applicable definite 4xx rejection
```

The persisted lead remains available and can be given a safe diagnostic.

### Unknown outcome

The most important reliability rule is:

> Unknown is not failure.

Examples of indeterminate outcomes include:

```text
timeout after possible request transmission
network interruption
lost acknowledgement
certain server-side failures where execution cannot be proven
```

Consider:

```text
Next.js sends webhook
        ↓
n8n receives webhook
        ↓
workflow begins
        ↓
network response is lost
        ↓
Next.js observes timeout
```

The timeout does **not** prove that n8n failed to run.

Therefore:

```text
timeout ≠ proof of non-execution
```

For an indeterminate trigger result, the implementation preserves the lead and can record:

```text
AUTOMATION_TRIGGER_OUTCOME_UNKNOWN
```

without falsely claiming a known failure.

The application should not blindly resend simply because an acknowledgement was lost.

This matters because an unsafe retry could send the same customer two messages.

## 12. n8n Production Workflow

The production workflow is named:

```text
XBOT EV - Lead Response
```

Its successful processing path is:

```text
Webhook
   ↓
HTTP Request1
Processing Callback
   ↓
Edit Fields
   ↓
HTTP Request
Resend
   ↓
HTTP Request2
Sent Callback
```

The workflow remains intentionally small.

Its job is orchestration, not business-state authority.

The application remains responsible for validating lifecycle transitions before mutating the database.

### Webhook node

Receives the authenticated lead payload from Next.js.

Important values supplied from the incoming body include:

```text
leadId
name
email
interest
```

### Processing callback node

The first HTTP callback reports that workflow processing has started.

Current callback endpoint:

```text
https://xbot-task-4.vercel.app/api/automation/callback
```

Authentication uses an n8n Header Auth credential with header:

```text
x-xbot-callback-key
```

Conceptual JSON payload:

```json
{
  "leadId": "<lead-id>",
  "status": "processing",
  "workflowExecutionId": "<n8n-execution-id>"
}
```

The workflow execution identifier is obtained from:

```text
{{$execution.id}}
```

For values originating at the webhook, explicit webhook references are preferred when later nodes may replace the current `$json`.

For example:

```text
{{$('Webhook').item.json.body.leadId}}
{{$('Webhook').item.json.body.name}}
{{$('Webhook').item.json.body.email}}
{{$('Webhook').item.json.body.interest}}
```

This prevents data from accidentally disappearing after a preceding HTTP Request node changes the node output.

### Edit Fields node

The workflow prepares the controlled email values from the original lead.

The important principle is:

```text
lead name   → original webhook payload
lead email  → original webhook payload
interest    → original webhook payload
```

rather than trusting an unrelated intermediate node response.

### Resend node

n8n performs:

```http
POST https://api.resend.com/emails
```

The message is sent using a secure n8n credential for the Authorization header.

The sender used in the workflow is configured as an XBOT EV sender, for example:

```text
XBOT EV <noreply@ai.shoaib.ink>
```

The actual Resend API key is not placed in this repository or README.

### Sent callback node

After Resend accepts the request, n8n reports completion to the application.

Conceptual payload:

```json
{
  "leadId": "<lead-id>",
  "status": "sent",
  "providerMessageId": "<resend-id>",
  "workflowExecutionId": "<n8n-execution-id>"
}
```

The provider identifier comes from the Resend node response.

The workflow can reference it using the relevant Resend HTTP node, for example:

```text
{{$('HTTP Request').item.json.id}}
```

and the lead identity can continue to come directly from the original webhook:

```text
{{$('Webhook').item.json.body.leadId}}
```

## 13. Deterministic Personalized Email

The email does not use AI-generated prose.

It uses an approved deterministic template containing the customer's own submitted information.

Conceptual content:

```text
Hello <name>,

Thank you for your interest in <interest>.

We've received your enquiry and the XBOT EV team will follow up regarding the next step.

XBOT EV
```

This satisfies the assessment requirement because both:

```text
name
```

and:

```text
stated interest
```

are incorporated into the automated response.

The deterministic structure provides:

```text
predictability
consistency
low latency
lower cost
easy QA
no hallucination
simpler governance
```

## 14. Authenticated n8n-to-Application Callback

Downstream workflow state is not written directly from an unauthenticated external caller.

n8n reports lifecycle changes through:

```http
POST /api/automation/callback
```

The callback uses:

```text
N8N_CALLBACK_SECRET
```

and expects the request header:

```text
x-xbot-callback-key
```

The application authenticates the callback before trusted lifecycle mutation.

This means the two privileged communication directions are separated:

```text
Next.js → n8n
N8N_WEBHOOK_SECRET

n8n → Next.js
N8N_CALLBACK_SECRET
```

The system does not reuse one secret for both directions.

## 15. Callback Validation and State Integrity

Authentication alone is not sufficient.

An authenticated callback still needs to be valid.

The callback validates information such as:

```text
leadId
status
providerMessageId
workflowExecutionId
errorCode
```

The lead identifier must be a UUID.

Allowed callback statuses are:

```text
processing
sent
failed
```

A successful `sent` transition requires provider evidence through a provider message identifier.

Lifecycle updates follow this conceptual policy:

```text
Incoming callback
       ↓
Authenticate
       ↓
Validate payload
       ↓
Check current persisted state
       ↓
Validate requested transition
       ↓
Apply conditional update
       ↓
Return safe result
```

The endpoint does **not** follow:

```text
incoming status
      ↓
blind database overwrite
```

Allowed transitions in the current implementation are:

```text
pending    → processing
pending    → failed
processing → sent
processing → failed
```

Terminal states:

```text
sent
failed
```

are protected.

Therefore a stale request such as:

```text
sent → processing
```

is rejected.

This protects the database from delayed, replayed, malformed, or out-of-order lifecycle changes.

## 16. Meaning of `sent`

The status:

```text
sent
```

has a precise meaning:

> The email provider accepted the send request successfully according to its API response.

It does **not** mean:

```text
guaranteed inbox delivery
guaranteed reading by recipient
guaranteed engagement
```

These are different events.

During project testing, actual inbox receipt was also manually observed, but the database state deliberately avoids claiming more than provider acceptance proves.

This distinction is maintained throughout the system:

```text
lead accepted
≠ workflow started
≠ provider accepted send
≠ inbox delivered
≠ recipient read
```

## 17. Provider and Workflow Traceability

A successful final lead record can contain:

```text
response_status
workflow_execution_id
provider_message_id
response_sent_at
error_code
```

These fields allow the operator to answer:

```text
Which lead was processed?
Which workflow execution handled it?
Did the email provider accept the request?
What provider operation ID was returned?
When was the successful response recorded?
Was a diagnostic error stored?
```

This provides assessment-level observability without introducing a large monitoring platform.

## 18. Duplicate Submission Protection

Duplicate handling exists at both the UX and database levels.

The frontend:

```text
generates submission UUID
retains it during one logical attempt
disables submission while active
creates a fresh UUID after successful completion
```

The API passes the UUID into:

```text
submission_id
```

The PostgreSQL unique partial index enforces:

```sql
create unique index if not exists leads_submission_id_unique
on public.leads (submission_id)
where submission_id is not null;
```

If the same logical request arrives again, PostgreSQL returns a uniqueness conflict.

The API recognizes that conflict, retrieves the existing lead by `submission_id`, and returns the original lead rather than creating another one.

Conceptual duplicate response:

```json
{
  "success": true,
  "leadId": "<existing-lead-id>",
  "status": "<existing-status>",
  "duplicate": true,
  "message": "Your enquiry has already been received."
}
```

The duplicate path finishes before a second automation trigger.

The intended behavior is therefore:

```text
same submissionId
      ↓
one persisted lead
      ↓
one logical automation
```

rather than:

```text
same submissionId
      ↓
lead A + lead B
      ↓
email A + email B
```

### Verified duplicate test

The duplicate behavior was tested by sending two sequential API requests containing the exact same submission UUID.

The first request returned:

```text
success          : True
leadId           : 789797e2-9e33-447c-849b-60fca91e927d
status           : pending
automationStatus : accepted
message          : Your enquiry has been received.
```

The second request returned:

```text
success   : True
leadId    : 789797e2-9e33-447c-849b-60fca91e927d
status    : pending
duplicate : True
message   : Your enquiry has already been received.
```

The identical `leadId` demonstrates that the duplicate request was associated with the original logical lead rather than producing a second lead identity.

**Current handover note:** this duplicate-hardening change was implemented and locally verified during the final hardening phase. Before the final external submission, the latest repository commit should be pushed and the deployed Vercel build should receive one final smoke test so the public deployment is proven to contain this latest code revision.

## 19. Security Boundary

Secrets are divided by responsibility.

### Next.js server environment

```text
SUPABASE_URL
SUPABASE_SECRET_KEY
N8N_WEBHOOK_URL
N8N_WEBHOOK_SECRET
N8N_CALLBACK_SECRET
```

### n8n credential storage

The Resend authorization credential is stored inside n8n credential management.

### Browser

The browser must never receive:

```text
SUPABASE_SECRET_KEY
N8N_WEBHOOK_SECRET
N8N_CALLBACK_SECRET
Resend API key
```

### Local development

Secrets live in:

```text
.env.local
```

The file is ignored by Git.

Verification:

```bash
git check-ignore .env.local
```

Expected output:

```text
.env.local
```

### Production

Next.js secrets are configured using Vercel Environment Variables.

Changing a Vercel environment variable requires a deployment that contains the updated production configuration.

### Credential hygiene rule

Real secrets must never be:

```text
committed to Git
included in README files
shown in screenshots
shown in demonstration videos
printed in public logs
placed in client code
```

Any credential that has previously been exposed outside its intended secret manager should be rotated before being treated as a long-term production credential.

## 20. Error and Reliability Model

The system aims to record what is known rather than what is assumed.

Useful diagnostic categories include facts such as:

```text
validation failed
database insertion failed
automation configuration missing
automation trigger rejected
automation trigger outcome unknown
callback unauthorized
invalid state transition
provider-related failure
```

The implementation does not use an error code to assert more than the system actually knows.

The core reliability rules are:

```text
Unknown is not failure.

Timeout is not proof of non-execution.

Authentication is not idempotency.

Provider acceptance is not inbox delivery.

A callback does not automatically own lifecycle truth.

Persisted current state participates in transition decisions.

Retry must be justified rather than automatic.
```

### Known durability boundary

This assessment implementation persists a lead and then triggers an external workflow.

It does not implement a transactional outbox, durable message queue, or distributed exactly-once delivery architecture.

Therefore the project does **not** claim:

```text
exactly-once distributed execution
guaranteed asynchronous delivery
enterprise message durability
```

The implemented duplicate submission protection substantially reduces repeated lead creation, but it should not be confused with a full distributed queue/outbox architecture.

For this assessment scope, the chosen architecture provides a strong balance between reliability, simplicity, evaluator visibility, and implementation risk.

## 21. Current Failure-Path Boundary

The application callback supports:

```text
pending → failed
processing → failed
```

and the lead trigger logic distinguishes known rejection from uncertain outcome.

The primary published n8n workflow demonstrated in production is:

```text
Webhook
→ Processing Callback
→ Edit Fields
→ Resend
→ Sent Callback
```

The project does **not** claim that an explicit separate n8n Resend-error branch that automatically performs a `failed` callback after every provider-node error has been production-verified.

That would be a reasonable future hardening improvement.

This README deliberately separates:

```text
implemented and verified
```

from:

```text
possible future extension
```

rather than exaggerating the current system.

## 22. Negative Security and Lifecycle Verification

The callback endpoint was explicitly tested against invalid conditions.

### Unauthorized callback

A callback without valid credentials returned a safe rejection:

```json
{
  "success": false,
  "error": "UNAUTHORIZED",
  "message": "Invalid callback credentials."
}
```

This verifies that an unauthenticated external caller cannot freely mutate lifecycle state.

### Invalid callback UUID

A malformed lead identifier was submitted with otherwise valid callback authentication.

Observed HTTP result:

```text
400
```

This verifies schema-level callback validation.

### Invalid lifecycle transition

A known `sent` lead was used to test:

```text
sent → processing
```

Observed HTTP result:

```text
409
```

This verifies that a terminal state cannot simply be moved backward.

## 23. Production End-to-End Verification

The application has been tested through the actual production chain rather than only through localhost.

The verified route was:

```text
Vercel production frontend
          ↓
Vercel Next.js API
          ↓
Supabase PostgreSQL
          ↓
published n8n production webhook
          ↓
processing callback
          ↓
Resend provider operation
          ↓
sent callback
          ↓
Supabase final lifecycle state
```

A successful production record demonstrated:

```text
response_status       = sent
workflow_execution_id = populated
provider_message_id   = populated
response_sent_at      = populated
error_code            = NULL
```

Representative verified production executions included workflow execution IDs:

```text
21
22
23
```

The production-environment correction test used workflow execution:

```text
22
```

and produced a real provider message identifier:

```text
580f7581-f72f-4844-b37c-f731c6ca41b3
```

with:

```text
error_code = NULL
```

A later credential-hardening production test successfully executed as workflow:

```text
23
```

after the Resend API authorization had been moved into an n8n credential.

This demonstrated that credential hardening did not break the production automation.

Actual received email was also observed during testing.

## 24. Build, Type and Responsive Verification

The project has been tested using:

```bash
npm run build
```

with successful Next.js production compilation and TypeScript checking.

The project has also been tested using:

```bash
npm run lint
```

without blocking lint errors.

Responsive QA covered:

```text
desktop viewport
mobile viewport
narrow layout
```

The final interface was checked for:

- page overflow
- destructive cropping
- layout stacking
- hero visibility
- typography readability
- form usability
- input sizing
- textarea usability
- CTA visibility
- success feedback
- mobile composition

The design was kept intentionally restrained after functional reliability was established.

## 25. Project File Structure

The important application structure is:

```text
xbot-task-4/
│
├── public/
│   └── images/
│       └── xbot-ev-hero.png
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── leads/
│   │   │   │   └── route.ts
│   │   │   │
│   │   │   └── automation/
│   │   │       └── callback/
│   │   │           └── route.ts
│   │   │
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   └── lib/
│       └── supabase-server.ts
│
├── docs/
│   ├── architecture.md
│   └── build-vs-reuse.md
│
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

Everything required to understand the final architecture is also described in this README, so the reviewer is not required to read the internal planning documents in order to understand the project.

The core files have these responsibilities:

```text
src/app/page.tsx
→ customer-facing UI
→ form state
→ temporary submission identity
→ loading/error/success UX

src/app/api/leads/route.ts
→ authoritative validation
→ database persistence
→ duplicate handling
→ secure n8n trigger
→ trigger outcome classification

src/app/api/automation/callback/route.ts
→ callback authentication
→ callback validation
→ lifecycle authorization
→ conditional database state update

src/lib/supabase-server.ts
→ server-only Supabase client

public/images/xbot-ev-hero.png
→ primary XBOT EV product visual
```

## 26. Complete Local Setup

### Prerequisites

The project was developed using a modern Node.js/npm environment.

Verified development tooling included:

```text
Node.js 22.14.0
npm 10.9.2
Git 2.47.1
```

A compatible modern Node.js environment should be used.

### Clone the repository

```bash
git clone https://github.com/Shoaibstat876/xbot-task-4.git
cd xbot-task-4
```

### Install dependencies

```bash
npm install
```

### Create local environment file

Create:

```text
.env.local
```

with:

```env
SUPABASE_URL=
SUPABASE_SECRET_KEY=
N8N_WEBHOOK_URL=
N8N_WEBHOOK_SECRET=
N8N_CALLBACK_SECRET=
```

Never put real secret values into Git.

### Run locally

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

### Verify production compilation

```bash
npm run build
```

### Verify lint

```bash
npm run lint
```

## 27. Complete Supabase Reproduction

Create a Supabase project.

Create the `leads` table with the lifecycle and traceability fields described earlier.

A suitable reproduction schema is:

```sql
create extension if not exists pgcrypto;

create table if not exists public.leads (
  lead_id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  interest text not null,
  response_status text not null default 'pending'
    check (response_status in ('pending', 'processing', 'sent', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  submission_id uuid,
  workflow_execution_id text,
  response_sent_at timestamptz,
  error_code text,
  provider_message_id text
);

create unique index if not exists leads_submission_id_unique
on public.leads (submission_id)
where submission_id is not null;
```

The Next.js application should use a server-side credential with the required database permission.

Do not expose that privileged credential to browser code.

## 28. Complete n8n Reproduction

Create a workflow named:

```text
XBOT EV - Lead Response
```

Build:

```text
Webhook
   ↓
Processing Callback
   ↓
Edit Fields
   ↓
Resend HTTP Request
   ↓
Sent Callback
```

### Webhook

Configure a POST webhook.

Use authenticated access.

The Next.js server should provide:

```text
x-xbot-automation-key
```

with the private expected value.

Publish the workflow and place its **production** webhook URL into:

```text
N8N_WEBHOOK_URL
```

### Processing Callback

POST to:

```text
https://xbot-task-4.vercel.app/api/automation/callback
```

or the equivalent URL for a reproduced deployment.

Use Header Auth:

```text
x-xbot-callback-key
```

Payload:

```json
{
  "leadId": "={{ $('Webhook').item.json.body.leadId }}",
  "status": "processing",
  "workflowExecutionId": "={{ $execution.id }}"
}
```

The exact n8n expression UI may display expressions differently, but the underlying values must come from the original webhook and current execution.

### Edit Fields

Prepare:

```text
name
email
interest
```

from the original `Webhook` node.

Avoid depending on the response body of the processing callback for original lead information.

### Resend Request

Configure:

```text
POST https://api.resend.com/emails
```

Use an n8n Header Auth credential.

Credential header:

```text
Authorization
```

Credential value conceptually:

```text
Bearer <RESEND_API_KEY>
```

Never put the actual key in this README.

Prepare an XBOT EV message containing:

```text
name
interest
```

and send to the lead's submitted email address.

### Sent Callback

POST to:

```text
https://xbot-task-4.vercel.app/api/automation/callback
```

using the same callback Header Auth credential.

Supply:

```json
{
  "leadId": "={{ $('Webhook').item.json.body.leadId }}",
  "status": "sent",
  "providerMessageId": "={{ $('HTTP Request').item.json.id }}",
  "workflowExecutionId": "={{ $execution.id }}"
}
```

If the Resend node is renamed, update the expression so it references the actual provider request node.

Publish the workflow after saving changes.

## 29. Complete Vercel Reproduction

Import:

```text
https://github.com/Shoaibstat876/xbot-task-4
```

into Vercel as a Next.js project.

Configure these production variables:

```text
SUPABASE_URL
SUPABASE_SECRET_KEY
N8N_WEBHOOK_URL
N8N_WEBHOOK_SECRET
N8N_CALLBACK_SECRET
```

Do not expose their values.

Deploy.

After any production environment-variable change, redeploy so the active deployment receives the updated configuration.

The current live application is:

```text
https://xbot-task-4.vercel.app
```

## 30. Verification Procedure for a Fresh Installation

A reproduction should not be declared successful merely because the page loads.

Verify the complete chain.

Submit a unique test lead through the UI.

Confirm:

```text
1. UI reports safe lead receipt
2. Supabase creates one new lead
3. initial status is pending
4. n8n receives the production webhook
5. n8n has a real execution ID
6. processing callback is accepted
7. status becomes processing
8. email contains lead name
9. email contains stated interest
10. Resend accepts the send request
11. provider message ID exists
12. sent callback is accepted
13. database status becomes sent
14. response_sent_at is populated
15. workflow_execution_id is populated
16. provider_message_id is populated
17. error_code is NULL for successful execution
18. received email can be demonstrated where practical
```

Then perform negative checks:

```text
19. callback without valid authentication is rejected
20. malformed callback UUID is rejected
21. terminal-state regression is rejected
22. duplicate submission ID does not create a second logical lead
```

Then run:

```bash
npm run build
npm run lint
```

Finally inspect desktop and mobile layouts.

## 31. Evidence-Driven Definition of Success

The project distinguishes several events that should never be conflated.

```text
Lead accepted
→ valid lead persisted

Automation accepted
→ n8n trigger accepted / workflow evidence exists

Processing
→ workflow has begun processing and callback updated state

Sent
→ email provider accepted send operation

Delivered
→ provider/inbox evidence indicates delivery

Received
→ actual recipient test demonstrates receipt
```

The system only claims the stage supported by evidence.

This is one of the central governance principles of the project:

> Evidence first. Verdict second.

## 32. Build-vs-Reuse Decision

The project intentionally combines custom business logic with managed infrastructure.

Custom-built application responsibilities include:

```text
XBOT EV interface
form UX
submission UUID lifecycle
lead API
Zod validation
Supabase persistence logic
automation trigger logic
trigger outcome classification
callback API
callback authentication
lifecycle policy
duplicate handling
state integrity
user feedback
```

Managed infrastructure is reused for:

```text
Supabase → PostgreSQL
n8n      → workflow orchestration
Resend   → transactional email
Vercel   → deployment
GitHub   → source hosting
```

This avoids rebuilding mature infrastructure while retaining ownership of XBOT-specific application logic.

The project was deliberately not made more complicated simply to appear technically advanced.

## 33. Organisational Value

The architecture provides practical value beyond technical demonstration.

### Lead durability

The enquiry is persisted before downstream automation.

A temporary automation issue does not automatically erase the business lead.

### Immediate acknowledgement

The customer receives an automated personalized response without waiting for a human to manually send the first message.

### Consistent communication

The deterministic template avoids inconsistent wording.

### Personalization

Each response includes the actual submitted name and interest.

### Traceability

A lead can be related to:

```text
submission ID
workflow execution ID
provider operation ID
response timestamp
diagnostic code
```

### Reduced accidental duplication

A database-enforced submission identity reduces the risk of repeated lead creation.

### Clear operational state

The business can distinguish:

```text
captured
processing
sent
failed
```

instead of having only a form submission with no downstream visibility.

### Security

Privileged credentials remain on trusted server/credential boundaries.

### Maintainability

Responsibilities are separated cleanly:

```text
React / page.tsx
→ customer interaction

Next.js APIs
→ trusted application logic

Supabase
→ persistence

n8n
→ orchestration

Resend
→ email transport

Vercel
→ production hosting
```

## 34. Known Scope Boundaries and Future Hardening

The current implementation intentionally remains appropriate to assessment scale.

It does not currently include:

```text
CRM integration
sales dashboard
WhatsApp channel
durable queue
transactional outbox
automatic retry worker
dead-letter queue
full provider-delivery webhook tracking
explicit verified n8n provider-error callback branch
lead scoring
AI classification
LLM response generation
admin portal
analytics dashboard
```

These are not necessary to demonstrate the required working automation.

Possible future additions include:

```text
WhatsApp integration
CRM synchronization
sales representative assignment
lead scoring
follow-up sequence
provider delivery event tracking
automatic controlled retries
dead-letter workflow
admin lead dashboard
analytics
appointment booking
multilingual templates
consent management
```

A production system operating at larger scale could also replace the direct post-persistence trigger boundary with a transactional outbox or durable queue.

## 35. Cost and Dependency Disclosure

The project uses:

```text
GitHub
Vercel
Supabase
n8n Cloud
Resend
```

No unsupported pricing claim is included in this documentation.

The final submission should report an actual paid cost only if a paid charge was genuinely incurred during the assessment.

If the services were used through free tiers, trials, or already-available accounts, the final submission should describe that truthfully rather than inventing a monetary amount.

## 36. Repository and Handover Checks

Before final submission, run:

```bash
git status
```

Expected after the final documentation/deployment commit:

```text
nothing to commit, working tree clean
```

Verify `.env.local` remains ignored:

```bash
git check-ignore .env.local
```

Expected:

```text
.env.local
```

Then run:

```bash
npm run build
npm run lint
```

Commit the latest implementation and documentation.

Push:

```bash
git push origin main
```

Confirm Vercel creates the latest production deployment.

Then perform one fresh production smoke test against:

```text
https://xbot-task-4.vercel.app
```

The final production smoke test should verify that the deployed version includes the latest duplicate-protection hardening rather than relying only on the local verification.

## 37. Final Implementation Status

| Capability | Status |
|---|---|
| XBOT EV branded interface | ✅ Implemented |
| Responsive desktop layout | ✅ Verified |
| Responsive mobile layout | ✅ Verified |
| Lead name capture | ✅ Implemented |
| Email capture | ✅ Implemented |
| Interest capture | ✅ Implemented |
| Client form states | ✅ Implemented |
| Accessible field feedback | ✅ Implemented |
| Server-side Zod validation | ✅ Implemented |
| PostgreSQL lead persistence | ✅ Implemented |
| `pending` lifecycle | ✅ Implemented |
| Authenticated n8n trigger | ✅ Implemented |
| Production n8n workflow | ✅ Verified |
| `processing` callback | ✅ Verified |
| Workflow execution tracking | ✅ Verified |
| Personalized lead name | ✅ Verified |
| Personalized lead interest | ✅ Verified |
| Resend email operation | ✅ Verified |
| Secure Resend credential | ✅ Verified |
| `sent` callback | ✅ Verified |
| Provider message ID tracking | ✅ Verified |
| Response timestamp | ✅ Verified |
| Callback authentication | ✅ Verified |
| Invalid UUID rejection | ✅ Verified |
| Invalid state rejection | ✅ Verified |
| Terminal-state protection | ✅ Verified |
| Trigger unknown-outcome handling | ✅ Implemented |
| Database submission idempotency | ✅ Implemented |
| Duplicate API behavior | ✅ Locally verified |
| Production core E2E flow | ✅ Verified |
| Actual test email receipt | ✅ Verified |
| Vercel deployment | ✅ Verified |
| Production build | ✅ Verified |
| Lint | ✅ Verified |
| Latest duplicate hardening deployed | ⏳ Final push/smoke verification required |
| Explicit provider-error n8n branch | Not claimed as verified |
| Exactly-once distributed delivery | Not claimed |
| Guaranteed inbox delivery | Not claimed |

## 38. Final Result

The completed solution satisfies the XBOT EV automation requirement through a real full-stack application and a real external workflow.

It is not merely:

```text
FORM
  ↓
EMAIL
```

The implemented system is:

```text
                    XBOT EV VISITOR
                           │
                           ▼
                 RESPONSIVE LEAD FORM
                           │
                           ▼
                  LOGICAL SUBMISSION ID
                           │
                           ▼
                     NEXT.JS API
                           │
                           ▼
                    ZOD VALIDATION
                           │
                           ▼
                 SUPABASE POSTGRESQL
                           │
                  status = pending
                           │
                           ▼
                AUTHENTICATED n8n TRIGGER
                           │
                           ▼
                  PROCESSING CALLBACK
                           │
                status = processing
                           │
                           ▼
               DETERMINISTIC PERSONALIZATION
                           │
                           ▼
                     RESEND API
                           │
                  provider accepts
                           │
                           ▼
                     SENT CALLBACK
                           │
                  status = sent
                           │
                           ▼
            WORKFLOW + PROVIDER TRACEABILITY
```

The most important engineering properties are:

```text
real server boundary
+
durable lead persistence
+
authenticated external automation
+
controlled personalization
+
truthful lifecycle semantics
+
provider traceability
+
workflow traceability
+
state-transition protection
+
failure-awareness
+
database-level duplicate protection
+
responsive production UI
+
deployable and reproducible architecture
```

The design deliberately avoids unsupported product claims, unnecessary AI, unnecessary infrastructure, and exaggerated reliability claims.

The final implementation demonstrates not only that the automation works, but also why each component exists, how the systems communicate, how privileged operations are protected, how lifecycle truth is maintained, how duplicate requests are handled, how uncertain outcomes are represented, how the production chain was verified, and how another developer can reproduce the complete application.

**Live Application:** https://xbot-task-4.vercel.app  
**Source Repository:** https://github.com/Shoaibstat876/xbot-task-4  

**XBOT EV — Automated Lead Response System**