# Frontend AI Instructions

## Purpose
This file defines how AI should generate and modify code in the frontend of the E-Recruitment system.

The backend is already implemented and should be treated as a fixed API contract.

---

## General Rules

- Do not modify anything in the backend folder
- Do not invent backend endpoints
- Always follow the existing API contract defined in:
  ../docs/backend-integration-guide.md

- Prefer clean, maintainable, production-style code
- Avoid overengineering

---

## Tech Stack (must follow)

- React (latest stable)
- Functional components only
- Hooks-based architecture
- Axios or Fetch for API calls
- No class components

---

## API Integration Rules

- Base URL: http://localhost:8080/api
- All protected routes require:
  Authorization: Bearer <token>

- Never hardcode tokens
- Use a centralized API client

---

## Authentication Handling

- Store token in localStorage (temporary solution)
- On app load:
  1. Read token
  2. Call `/api/users/me`
  3. If success → restore session
  4. If failure → clear token

---

## Code Style

- Use clear naming (no abbreviations)
- Keep components small and focused
- Separate:
  - components
  - services (API calls)
  - hooks (logic)

---

## Folder Structure (recommended)

- src/
  - components/
  - pages/
  - services/
  - hooks/
  - utils/

---

## Error Handling

- Handle 403 globally (unauthorized)
- Show user-friendly messages
- Do not expose backend error details directly

---

## Do NOT do

- Do not change API field names
- Do not assume missing endpoints exist
- Do not mix business logic inside UI components

---

## When unsure

- Refer to backend-integration-guide.md
- Ask for clarification instead of guessing