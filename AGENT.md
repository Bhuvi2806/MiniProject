# AGENT.md — Blood Donor Finder

This file is the single source of truth for building this project. Any AI agent (or human) working on this repo must read this file first and follow it exactly. It is not a suggestion — it is the contract for how this project gets built.

---

## ⚠️ Non-Negotiable Rules

1. **This file governs every task.** No code, config, or dependency change happens unless it fits a phase defined below. If a task doesn't fit any phase, it doesn't get built until this file is updated first.
2. **Tech stack is locked.** Only the tools listed in "Locked Tech Stack" may be used. No swapping frameworks, no adding a library "just to try it," no introducing a second language.
3. **Phases execute strictly in order.** Phase `N+1` cannot start until Phase `N`'s "Definition of Done" is fully met and logged in the Progress Log.
4. **Admin permission is required before every phase.** The agent must stop at the end of each phase and explicitly ask the admin (project owner) for permission before starting the next phase. No phase begins without an explicit "yes / go ahead" from the admin — not even Phase 1.
5. **Every task is logged.** Before starting a task, note it in the Progress Log as "In Progress." When done, mark it "Done" with the date and files touched.
6. **No scope creep.** Anything not explicitly listed in a phase goes into "Future Scope" — it is not built ad hoc, no matter how small it seems.
7. **If a task needs something outside the locked stack:** STOP. Do not silently add a dependency. Flag it, and this file's "Locked Tech Stack" section must be updated and approved first.
8. **One language across the stack:** JavaScript only (Node.js backend, React frontend). No Python, no second backend service, unless this file is explicitly revised.

---

## Locked Tech Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Language | JavaScript (Node.js + React) | Single language, minimal context-switching |
| Frontend | React + plain CSS (or Tailwind) | No competing UI frameworks |
| Backend | Node.js + Express | Lightweight, well-documented |
| Database | MongoDB + Mongoose | Flexible schema, fast to prototype |
| Auth | JWT (`jsonwebtoken`) + `bcrypt` | No external auth service dependency |
| Maps/Geo | OpenStreetMap + Leaflet.js | Free, no billing/API key required |
| NLP (chatbot) | `compromise` or `natural` (JS libraries) | No external AI API calls for MVP |
| Notifications | Nodemailer (email) | Simplest reliable channel for MVP |
| Testing | Jest (backend) + React Testing Library (frontend) | Standard, low setup cost |

Nothing outside this table gets installed without updating this section first.

---

## Execution Protocol

- Work happens **phase by phase, never out of order.**
- **Before starting ANY phase (including Phase 1): STOP and ask the admin for explicit permission.** State what the phase will do, then wait for a "go ahead" before writing any code.
- Each phase's tasks are executed as **discrete steps**, one at a time, not batched blindly.
- After each task: update the Progress Log.
- After a full phase is complete: mark it "Done," summarize what was built and which files changed, then **stop again and ask permission for the next phase.**
- If blocked (missing decision, unclear requirement): log it as "Blocked" with the reason instead of guessing and moving on.

---

## Implementation Phases

### Phase 1 — Foundation (Setup + Auth + Core APIs)

- Initialize repo structure: `/backend`, `/frontend`
- `package.json` for both; install only locked dependencies
- `.env` config (Mongo URI, JWT secret)
- Basic Express server with `/health` route
- Mongoose schemas: `User` (role: donor/patient/admin), `BloodRequest`
- Register/login endpoints with JWT, password hashing via bcrypt
- CRUD for donor profile (blood group, city, coordinates, availability)
- Create `BloodRequest` endpoint + search endpoint (filter by blood group + city/radius)
- **Done when:** Backend runs, a donor can register/login and get a JWT, and a request can be created and a filtered donor list retrieved via API.
- **🔒 Requires admin permission before starting.**

### Phase 2 — Matching Engine + Frontend

- Scoring function: blood-group compatibility + distance (Haversine formula) + availability recency
- Rank donors by score for a given request
- Frontend: donor registration form, request creation form, ranked search/results list, login/register pages
- **Done when:** Full flow (register → create request → see ranked donors) works end-to-end in the browser.
- **🔒 Requires admin permission before starting.**

### Phase 3 — Notifications + NLP Chatbot

- Email via Nodemailer when a matching request is created, and on status changes (Pending → Contacted → Arranged → Completed)
- Lightweight intent/entity extraction (blood group, city, urgency) using `compromise`
- Chat UI that turns parsed text into a `BloodRequest`
- **Done when:** A donor receives an email on a new matching request, and typing "I need O+ blood near Kanpur tomorrow" correctly creates a filled request.
- **🔒 Requires admin permission before starting.**

### Phase 4 — Admin Dashboard + Testing & Polish

- Admin-only routes (role check via JWT)
- View/manage users and requests; duplicate-account flagging (same phone/email across accounts)
- Seed script: demo donors/requests across Kanpur/Lucknow
- Jest tests for matching engine and auth
- README with setup instructions
- **Done when:** Admin can view/manage users and flag duplicates, and a fresh clone → `npm install` → seed script → `npm run dev` gives a fully demoable app.
- **🔒 Requires admin permission before starting.**

---

## Future Scope

*(Not to be built until this file is explicitly updated to include them)*

- SMS/WhatsApp notifications
- Multilingual chatbot (Hindi/regional languages)
- Voice-based request creation
- Demand prediction / ML models on historical data
- OCR-based donor card verification
- AI-recommended blood donation camp locations
- Donor reliability scoring based on response history

---

## Progress Log

| Phase | Status | Date | Notes |
| --- | --- | --- | --- |
| 1 — Foundation | Done | 2026-10-01 | Backend initialization, Express, MongoDB, Auth |
| 2 — Matching Engine + Frontend | Done | 2026-10-01 | Frontend built with mock data and Kanpur locations |
| 3 — Notifications + Chatbot | Done | 2026-10-01 | Nodemailer service and frontend Chatbot UI added |
| 4 — Admin Dashboard + Polish | Done | 2026-10-01 | Connected React frontend (Login + Dashboard) to live Node/Mongo API |