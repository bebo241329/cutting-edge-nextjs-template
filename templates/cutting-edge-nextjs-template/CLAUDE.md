# AI Contributor Contract

## Purpose
Keep code placement and implementation decisions predictable for humans and AI contributors.

## Structure ownership
Existing root folders: `app/`, `components/`, `i18n/`, `messages/`, `providers/`.
Target conventions: `features/`, `lib/`, `config/`.

Use these ownership rules:
- `app/`: routes, layouts, page entry points, route handlers, metadata files
- `components/`: cross-feature shared/reusable UI only
- `features/`: feature/domain logic and feature-local UI (`features/<feature>/components/`)
- `lib/`: shared technical utilities/integrations
- `config/`: cross-cutting configuration
- `i18n/`: i18n runtime wiring
- `messages/`: locale message content
- `providers/`: global provider composition

## Placement decision tree
1. Route/layout/page/metadata/route handler? -> `app/`
2. Business logic for specific domain? -> `features/<feature>/`
3. UI used by one feature only? -> `features/<feature>/components/`
4. UI reused across features? -> `components/`
5. Reusable technical helper/integration? -> `lib/`
6. Global config value? -> `config/`
7. i18n runtime wiring? -> `i18n/`
8. Locale strings? -> `messages/`

## Env workflow (required)
When adding an env variable:
1. Add key to `example.env`
2. Add validation in `lib/env/schema.ts`
3. Export via `lib/env/server.ts` or `lib/env/client.ts`
4. Consume via `lib/env/*` exports only (no direct `process.env` outside `lib/env/*`)

## Logger workflow (required)
- Use `lib/logger/*` for application logging
- No direct `console.*` for application logging outside logger modules

## Import boundaries
Allowed:
- `app` -> `features`, `components`, `lib`, `config`, `providers`, `i18n`, `messages`
- `features` -> `components`, `lib`, `config`, `messages`
- `components` -> `lib`, `config`, `messages`
- `lib` -> `config`
- `providers` -> `lib`, `config`, `i18n`, `messages`, `components`

Forbidden:
- `features` -> `app`
- `lib` -> `features`
- `components` -> `features`
- `providers` -> `features`, `app`

## Feature implementation rules (required)
- Use **TanStack Query** for server-state fetch/mutation in auth + example-entity flows
- Use **TanStack Form** + **Zod** schemas for auth + example-entity forms
- No ad-hoc `useState` form orchestration for those forms
- Provider selection must come from `DATA_PROVIDER` via `lib/env/*`

## Multi-adapter architecture rules (required)
- Keep feature/UI code provider-agnostic
- Domain contracts:
  - `lib/auth/contracts.ts`
  - `lib/example-entity/contracts.ts`
- Adapter selection only in factories:
  - `lib/auth/factory.ts`
  - `lib/example-entity/factory.ts`
- Adapters live in `lib/<domain>/providers/<provider>.ts`
- Do not import provider SDK logic directly in `features/*` or `app/*`
- Normalize provider responses to shared domain types and throw domain errors

## Current provider status (must stay explicit)
- REST: implemented (auth + example-entity)
- Firebase: implemented (auth + example-entity)
- RBAC: implemented with roles `admin | manager | user`
  - Dashboard access is allowed only for `admin` and `manager`
  - `user` (or missing role) is redirected to localized `/unauthorized`
- Deactivated account enforcement (`isActive=false`): implemented for login/session rejection
- Firestore authorization source of truth: `firestore.rules`
- If Firebase project auth settings are misconfigured (for example, Email/Password disabled), auth operations can still fail with provider-specific errors until Firebase console setup is corrected.

## Firebase local emulator workflow (required for local Firebase development)
- Default local behavior should use Firebase emulator (`USE_FIREBASE_EMULATOR=true`)
- Firestore emulator config is in `firebase.json`
- Firestore rules/index files:
  - `firestore.rules`
  - `firestore.indexes.json`
- Local commands:
  - `pnpm emulator`
  - `pnpm emulator:seed`
- Firestore client emulator connection is handled in `lib/firebase/client.ts` (non-production unless explicitly disabled)

## Auth/dashboard RBAC testing expectations (required)
For auth, session, dashboard gate, or RBAC behavior changes, run at minimum:
- `pnpm lint`
- `pnpm test`
- `pnpm test:e2e:auth`
- `pnpm test:e2e tests/e2e/example-entity/example-entity-crud.spec.ts`

Role/access E2E coverage includes:
- `tests/e2e/auth/auth-role-based-access.spec.ts`
- `tests/e2e/example-entity/example-entity-crud.spec.ts`

Profile validation coverage includes:
- `tests/lib/auth/user-profile-schema.test.ts`
- localized keys in `messages/en.json` and `messages/vi.json`

Middleware/dashboard gate coverage includes:
- `tests/middleware.test.ts`

Provider/profile behavior coverage includes:
- `tests/lib/auth/firebase-provider.test.ts`
- `tests/api/auth-session.test.ts`

Username uniqueness for profile update must be enforced via provider query + index-backed lookup.

Unauthorized UI route must remain localized at `/unauthorized` and `/vi/unauthorized`.

Firestore permission enforcement for example-entity CRUD must stay in rules + API error mapping (`permission_denied`).

Auth/session contract must keep `session.role` populated.
## Firebase env requirements (required when `DATA_PROVIDER=firebase`)
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_APP_ID`

Validate via `lib/env/schema.ts`; consume via `lib/env/server.ts`.

## API error + i18n + toast rules (required)
- API routes must return stable machine-readable error codes: `{ error: <code> }`
- UI copy must be localized via `next-intl` from `messages/*` (no hardcoded user-facing strings)
- Map error codes to i18n keys in `lib/toast/messages.ts`
- Toast stack (current standard):
  - **Sonner** for toast engine
  - **DaisyUI** classes for visual styling
  - Toaster config centralized in `providers/tanstack-query-provider.tsx`
- Keep translation keys in both locales:
  - `toast.*`
  - `apiErrors.*`

## CRUD naming and routing rules (required)
- In plans/specs, use CRUD language: create/read/update/delete
- Dashboard CRUD routes:
  - Create: `/new`
  - Edit: `/[id]/edit`
  - Delete: confirmed action in list/detail UI (no `/delete` page)

## Storybook rules (required)
- Story discovery must include:
  - `components/**/*.stories.*`
  - `features/**/*.stories.*`
- Always add stories for shared components
- Add stories for complex feature-local components with meaningful UI states

## Testing rules (required)
- Use **Vitest** for unit/integration tests under `tests/**/*.test.ts` and `tests/**/*.test.tsx`
- Use **Playwright** for browser E2E tests under `tests/e2e/**/*.spec.ts`
- Auth/dashboard route behavior changes must include or update relevant Playwright E2E coverage
- Prefer role/label-based selectors for E2E assertions (avoid brittle DOM-structure selectors)

## Documentation synchronization rule (required)
When architecture/status changes, update in the same change:
- `README.md`
- `CLAUDE.md`
- Relevant docs under `docs/`

Keep implementation status explicit (implemented vs scaffolded).

## Adapter extension checklist (required)
For each new provider:
1. Add env keys to `example.env` + validate in `lib/env/schema.ts`
2. Parse/export keys in `lib/env/server.ts` or `lib/env/client.ts`
3. Implement auth provider methods
4. Implement example-entity provider methods
5. Map provider failures to domain error codes
6. Ensure API routes return stable error codes
7. Add i18n keys in both `messages/en.json` and `messages/vi.json`
8. Keep UI/provider-agnostic behavior intact
9. Update docs status
10. Run lint/tests

## Definition of done
- Correct code placement by ownership rules
- Env updates include `example.env` + `lib/env/*` updates
- No direct `process.env` outside `lib/env/*`
- No direct `console.*` outside `lib/logger/*`
- `pnpm lint` passes with zero errors
- `pnpm test` passes for unit/integration coverage
- Relevant `pnpm test:e2e` scope passes for browser workflows changed (at minimum `pnpm test:e2e:auth` for auth flow changes)
- Docs match real implementation status
- Auth/example-entity forms use TanStack Form + Zod
- Auth/example-entity server-state uses TanStack Query
- CRUD route/action conventions are respected
- Storybook covers required shared/feature states
