# XBOT EV Task 4 — Build vs Reuse Audit

## Phase
Phase 4 — Build-vs-Reuse Audit

## Approved Architecture

XBOT EV Lead Form
→ Next.js frontend
→ Next.js server API
→ Zod server validation
→ Supabase PostgreSQL
→ Authenticated server-to-n8n trigger
→ n8n workflow
→ Deterministic personalized email
→ Email provider
→ Authenticated callback
→ Conditional/authorized lifecycle update
→ Supabase persisted status

## USE EXISTING

### Next.js
Purpose: frontend and server API in one application.

Reason:
- reduces unnecessary service complexity
- provides a real server/API boundary
- good deployment support
- suitable for a small assessment implementation

### TypeScript
Purpose: static typing for application code.

Reason:
- improves maintainability
- reduces avoidable type-related defects
- improves API/data-model clarity

### Tailwind CSS
Purpose: UI styling.

Reason:
- already included in the project
- enables responsive custom XBOT EV styling
- avoids adding another UI dependency

### Zod
Purpose: server-side request validation.

Reason:
- validates lead input at the trusted server boundary
- provides predictable validation behavior

### Supabase PostgreSQL
Purpose: server-side persistence.

Reason:
- retains lead information independently of the browser
- supports traceability and lifecycle state

### n8n
Purpose: workflow automation.

Reason:
- clearly demonstrates real automation
- provides inspectable workflow execution evidence
- suitable for the assessment scope

### Email Provider
Purpose: send the personalized lead-response message.

Selection will be finalized during the email-delivery phase based on:
- reliability
- simplicity
- credential availability
- demonstrability
- reproducibility

### Vercel
Purpose: deployment of the Next.js application.

Reason:
- straightforward Next.js deployment
- suitable for final demonstration

---

## BUILD CUSTOM

### XBOT EV Lead Form
Built specifically around the verified XBOT EV Task 4 workflow and brand.

### POST /api/leads
Custom server endpoint for lead acceptance.

### Validation Rules
Custom rules based on required lead fields.

### Lead Data Model
Custom persistence model for lead identity and response lifecycle.

### Automation Authentication
Custom secure boundary between application and n8n.

### Lifecycle Logic
Custom controlled transitions for:
- pending
- processing
- sent
- failed

Unknown outcomes will be represented truthfully through safe diagnostics.

### Automation Callback
Custom authenticated and authorized callback handling.

### Personalized Message Template
Deterministic template using:
- lead name
- stated interest

### XBOT EV UI Composition
Custom interface based on supplied XBOT EV brand material.

---

## DO NOT USE

For the current scope we will not add:

- LLM
- AI agent
- RAG
- vector database
- FastAPI
- microservices
- Redis
- Kafka
- generic SaaS templates
- random AI skill packs
- unnecessary UI frameworks

Reason:

The verified Task 4 requirement only needs a small working lead-response automation. These additions would increase complexity without providing sufficient assessment value.

---

## Engineering Principle

Use existing maintained tools for commodity capabilities.

Build custom logic where XBOT EV workflow, security, lifecycle, branding, or business behavior requires project-specific control.

Mandatory delivery takes priority over optional complexity.