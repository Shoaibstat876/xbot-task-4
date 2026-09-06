# XBOT EV Task 4 — Architecture

## Phase
Phase 2 — Architecture

## Objective

Build a small working lead-response automation for XBOT EV that:

- accepts a test lead form submission
- uses the lead's name
- uses the lead's stated interest
- sends a personalized email response
- persists lead and lifecycle state server-side
- keeps privileged automation paths authenticated
- represents downstream outcomes truthfully

## Approved Architecture

XBOT EV Lead Form
→ Next.js frontend
→ Next.js server API
→ POST /api/leads
→ Zod server validation
→ Supabase PostgreSQL
→ lead persisted with response_status = pending
→ authenticated server-to-n8n trigger
→ n8n workflow
→ deterministic personalized email
→ email provider
→ authenticated callback to application
→ authorization + transition validation
→ conditional/atomic lifecycle mutation
→ Supabase persisted status

## Core Components

### 1. Next.js Frontend

Responsibility:

- render the XBOT EV lead form
- collect name, email, and stated interest
- show loading, success, and error states
- provide accessible and responsive interaction

The frontend does not own privileged credentials or authoritative workflow state.

---

### 2. Next.js Server API

Primary endpoint:

`POST /api/leads`

Responsibilities:

- receive lead submission
- validate input server-side
- persist accepted lead
- trigger downstream automation securely
- return a safe client response

A successful API response confirms lead acceptance and persistence only.

It does not automatically mean the email was sent or delivered.

---

### 3. Zod Validation

Purpose:

- authoritative server-side validation

Expected fields:

- name
- email
- interest

Validation includes:

- required fields
- valid email format
- whitespace trimming
- reasonable length limits
- invalid type rejection
- malformed payload rejection

---

### 4. Supabase PostgreSQL

Purpose:

- server-side persistence
- lifecycle traceability

Initial lead state:

`pending`

Core persisted fields should include:

- lead_id
- name
- email
- interest
- created_at
- response_status

Supporting fields where technically applicable and actually implemented:

- updated_at
- submission_id
- workflow_execution_id
- response_sent_at
- error_code
- provider_message_id

`workflow_execution_id` and `provider_message_id` must only be persisted when the relevant external system actually provides them.

Database access policy:

- privileged Supabase credentials remain server-side only
- service-role credentials must never be exposed to browser code
- if browser-accessible Supabase APIs are introduced, Row Level Security must be deliberately configured and tested
- the frontend will not directly own privileged lifecycle mutations

---

### 5. Authenticated Automation Trigger

Direction:

Next.js backend
→ authenticated n8n webhook

The browser must not call the privileged automation webhook directly.

Authentication may use:

- a server-side secret header
- bearer token
- another justified authenticated mechanism

The exact mechanism will be finalized during implementation.

---

### 6. n8n Workflow

Purpose:

- execute the lead-response automation
- provide inspectable workflow evidence
- send the personalized email
- report truthful downstream state

Conceptual flow:

Trigger
→ authenticate
→ validate
→ processing
→ create deterministic message
→ send email
→ report outcome
→ safe logging

The workflow should remain small and understandable.

---

### 7. Deterministic Personalized Email

The message uses verified lead fields:

- name
- stated interest

Example structure:

Hello {{name}},

Thank you for your interest in {{interest}}.

We've received your enquiry and the XBOT EV team will follow up regarding the next step.

XBOT EV

No LLM is required because deterministic templating is:

- simpler
- safer
- more reproducible
- easier to test
- sufficient for the verified Task 4 requirement

---

### 8. Email Provider

One provider will be selected during the email-delivery phase.

Selection criteria:

- reliability
- setup simplicity
- credential availability
- demonstrability
- reproducibility
- practical assessment usage

Email is selected as the primary channel because the official brief allows WhatsApp or email, and email provides the lower-risk implementation path for this assessment.

---

### 9. Authenticated Callback

Direction:

n8n
→ authenticated Next.js callback/API
→ application authorization
→ lifecycle transition validation
→ database

The callback must not directly overwrite arbitrary state.

Before mutation, the application must verify:

- authentication
- authorization
- target lead existence
- payload validity
- allowed fields
- current persisted state
- requested next state
- allowed lifecycle transition

Authentication alone does not make a callback safe to process repeatedly.

Replay or duplicate callback behavior must not corrupt lifecycle state.

---

### 10. Lifecycle Model

Canonical states:

- pending
- processing
- sent
- failed

#### pending

Lead exists server-side and downstream processing has not been confirmed as started.

#### processing

There is sufficient evidence that the automation system accepted or began processing the lead.

Examples of evidence may include:

- successful authenticated webhook acceptance
- confirmed n8n execution ID
- verified workflow execution record

A transport request alone does not prove processing.

#### sent

The email provider accepted the send operation according to its contract.

This does not automatically mean inbox delivery.

Preferred interpretation:

> The provider accepted the send request successfully.

#### failed

A known processing or sending failure occurred.

This state should only be used when failure is sufficiently established.

---

## Indeterminate Outcomes

Unknown must not be treated automatically as failure.

Possible examples:

- trigger timeout after possible transmission
- dropped connection after possible workflow acceptance
- upstream timeout where downstream execution cannot be proven
- external service timeout where completion cannot be proven

In these cases:

- retain the persisted lead
- retain immutable lead identity
- retain submission identity where implemented
- record safe diagnostic evidence
- use a diagnostic such as `AUTOMATION_TRIGGER_OUTCOME_UNKNOWN`
- inspect workflow execution evidence where practical
- do not blindly retry
- retry only when duplicate risk is controlled

Core principle:

**Unknown is not failure.**

Timeout is not proof of non-execution.

---

## State Transition Integrity

Lifecycle updates must be validated against the current persisted database state.

Conceptual rule:

incoming event
→ authenticate
→ authorize
→ validate payload
→ load/check current persisted state
→ validate requested transition
→ apply conditional/atomic mutation
→ record safe trace
→ return safe result

Do not use:

incoming status
→ direct database overwrite

for privileged lifecycle changes.

A callback does not own lifecycle truth merely because it arrived.

The application owns lifecycle-policy enforcement.

---

## Terminal-State Protection

Terminal-state behavior must be deliberate.

At minimum:

- a verified successful send state must not be casually overwritten by a stale failure callback
- delayed or duplicated callbacks must not regress newer truthful state
- invalid transitions must be rejected
- metadata may be updated only where doing so does not falsify lifecycle state

Exact terminal-state semantics will be implemented consistently with the final lifecycle model.

---

## Callback Replay Safety

Authenticated callbacks may still be duplicated.

Where practical, callback safety may use:

- workflow execution ID
- provider event ID
- event/request identifier
- transition guards
- idempotent status mutation

Repeated processing of the same logical callback must not corrupt state or trigger unrelated side effects.

Authentication is not idempotency.

---

## Retry Governance

Retry is allowed only when justified.

Before retrying, determine:

- whether the previous operation definitely failed
- whether it may already have succeeded
- whether duplicate sending is possible
- whether idempotency protection exists
- whether provider semantics support safe retry
- whether workflow or provider evidence is available

Retry categories:

### Safe Automatic Retry
Use only when duplicate execution risk is adequately controlled.

### Controlled Manual Retry
Use when human verification is needed before repeating the action.

### Do Not Retry Yet
Use when the previous operation may already have executed and evidence is insufficient.

Never retry merely because:

- a timeout occurred
- the UI did not receive success
- the backend did not receive an acknowledgement

---

## Security Boundary

Privileged credentials remain server-side.

Never expose:

- Supabase service-role secrets
- n8n webhook secrets
- callback secrets
- email provider API keys
- private bearer tokens

Privileged authentication or authorization uncertainty must fail closed.

Invalid, missing, malformed, or unverifiable privileged credentials must not be allowed to continue privileged execution.

The application must not:

- mutate state before authorization
- process privileged callback data before authentication
- log full secrets
- expose secret comparison details
- continue execution after failed credential validation

---

## Duplicate Protection

Frontend behavior:

- disable submit during active request
- show loading state
- prevent rapid repeated clicks

Server-side idempotency may use a `submission_id` where safely implemented.

Identifier meanings remain separate:

- `lead_id` — persisted lead record
- `submission_id` — one logical submission attempt
- `workflow_execution_id` — downstream automation execution
- `provider_message_id` — provider send operation

These identifiers must not be treated as interchangeable.

An email address must not be used as permanent idempotency identity.

A repeated logical submission must not accidentally create duplicate messages.

---

## Error Code Discipline

Safe error codes should describe known facts only.

Possible examples:

- `VALIDATION_FAILED`
- `DATABASE_INSERT_FAILED`
- `AUTOMATION_AUTH_REJECTED`
- `AUTOMATION_TRIGGER_FAILED`
- `AUTOMATION_TRIGGER_OUTCOME_UNKNOWN`
- `WORKFLOW_PROCESSING_FAILED`
- `PROVIDER_SEND_FAILED`
- `PROVIDER_OUTCOME_UNKNOWN`
- `CALLBACK_UNAUTHORIZED`
- `INVALID_STATE_TRANSITION`
- `CALLBACK_REPLAY_REJECTED`

Do not use an error code that asserts more than the system actually knows.

---

## Observability

Assessment-level observability should allow us to answer:

- which lead was processed?
- which logical submission created it?
- did automation begin?
- which workflow execution handled it where available?
- did the provider accept the send operation?
- what lifecycle state is persisted?
- what safe diagnostic exists if failure occurred?
- can the evaluator trace the main workflow?

We do not need a large monitoring stack for this assessment.

Simple evidence may include:

- structured server logs
- persisted lifecycle state
- n8n execution evidence
- provider evidence
- received test email where practical

---

## External Service Failure Language

For systems such as:

- n8n
- Supabase
- email provider
- deployment platform

distinguish between:

### Our Application Failure
A defect controlled by our implementation.

### External Service Failure
The external service did not behave successfully according to the observed interaction.

### Unknown External Outcome
The system cannot determine whether the external operation completed.

Do not automatically blame the application, provider, network, or platform without evidence.

---

## Architecture Trade-offs

This architecture deliberately avoids:

- separate FastAPI backend
- microservices
- Kafka
- Redis
- RAG
- vector database
- LLM
- AI agent
- unnecessary enterprise infrastructure

Reason:

The verified XBOT EV Task 4 requirement is small and focused.

The selected architecture provides:

- real backend behavior
- server-side persistence
- real automation
- secure privileged boundaries
- truthful lifecycle state
- evaluator-visible evidence
- reasonable retry safety
- manageable implementation complexity

without unnecessary complexity.

---

## Why No LLM Is Required

The automation only needs to personalize known fields:

- lead name
- stated interest

A deterministic template is preferred because it is:

- predictable
- testable
- governable
- reproducible
- low-complexity
- resistant to hallucination
- resistant to prompt injection

Not using an LLM here is a technical judgment decision, not a missing AI feature.

---

## MVP Preservation Rule

Hardening must not destroy mandatory delivery.

Priority order:

Mandatory working flow
→ server-side persistence
→ secure automation
→ functional testing
→ important failure handling
→ reasonable duplicate safety
→ premium UI
→ deployment
→ documentation
→ submission

Enterprise-scale infrastructure is not required unless the verified company brief requires it.

---

## Final Architecture Principle

Use the smallest complete architecture that satisfies the verified Task 4 requirement while remaining:

- technically defensible
- secure enough for the demonstrated assessment scope
- reproducible
- truthful
- testable
- easy to explain
- resistant to unnecessary complexity

**Evidence first. Verdict second.**