# Todo Frontend Architecture & Integration Guide

This document explains how the Todo Frontend interacts with the authentication (Auth) and Todo backend services. It expands on the root `README.md` with end-to-end request flows, environment configuration, and implementation references for each integration touchpoint.

## High-Level Architecture

```text
Browser (React SPA)
 └─ AuthProvider (src/hooks/useAuth.js)
     ├─ authService (src/services/api.js) → Auth Service
 └─ Todo Views (Dashboard, components)
     ├─ useTodos hook (src/hooks/useTodos.js)
         └─ todoService (src/services/api.js) → Todo Service
```

The frontend is a React single-page application that maintains session-aware state for both authentication and todo management. API communication is consolidated in `src/services/api.js`, which exposes service-specific helpers for the Auth and Todo backends. React context providers and hooks wrap these helpers to drive the UI pages and components.【F:src/services/api.js†L1-L89】【F:src/hooks/useAuth.js†L1-L77】【F:src/hooks/useTodos.js†L1-L90】

## Environment Configuration

All network endpoints are configured through environment variables. Default fallbacks are provided for local development, but production deployments should override these values.

| Variable | Purpose | Consumed In |
| --- | --- | --- |
| `REACT_APP_AUTH_BASE_URL` | Base URL for the Auth service (e.g. `http://localhost:3001`). | Axios instance `authApi` in `src/services/api.js`. |
| `REACT_APP_API_BASE_URL` | Base URL for the Todo service (e.g. `http://localhost:3002`). | Axios instance `todoApi` in `src/services/api.js`. |
| `REACT_APP_FRONTEND_URL` | Public URL of the frontend (optional, used for CORS configuration). | Referenced in environment examples and deployment docs. |

The axios clients enable `withCredentials` to propagate cookies/session tokens exchanged with the backend services, making the frontend compatible with cookie-based authentication setups.【F:src/services/api.js†L1-L18】

## Authentication Flow

### 1. Application Bootstrap

- `AuthProvider` mounts at the root of the app (`App.js`) and immediately calls `checkAuthStatus()` inside a `useEffect`.【F:src/App.js†L40-L53】【F:src/hooks/useAuth.js†L19-L37】
- `checkAuthStatus()` uses `authService.checkAuth()` to call `GET /is-logged-in` on the Auth service. The Auth service returns `{ success, isLoggedIn, user }`, which determines whether the UI treats the visitor as authenticated.【F:src/hooks/useAuth.js†L24-L37】【F:src/services/api.js†L32-L39】

### 2. Login

- Login submissions in `pages/Login.js` call the `login()` function provided by `AuthProvider`.【F:src/pages/Login.js†L1-L72】
- `login()` delegates to `authService.login(username, password)` which sends a `POST /login` request containing the credentials. On success, the returned user object is stored in state, making `isAuthenticated` truthy.【F:src/hooks/useAuth.js†L39-L55】【F:src/services/api.js†L20-L28】
- Errors from the backend are surfaced to the UI so the user receives inline feedback.【F:src/hooks/useAuth.js†L39-L55】【F:src/pages/Login.js†L74-L113】

### 3. Logout

- `logout()` calls `authService.logout()` (a `POST /logout` request) and clears the user state regardless of backend success, ensuring the local session is terminated.【F:src/hooks/useAuth.js†L57-L76】【F:src/services/api.js†L28-L36】

### 4. Authenticated State Usage

- Components consume `useAuth()` for the `user`, `isAuthenticated`, and `loading` values to conditionally render protected content. The dashboard page guards access to todo data until the auth state confirms the user is logged in.【F:src/hooks/useAuth.js†L5-L18】【F:src/hooks/useAuth.js†L68-L76】【F:src/App.js†L9-L39】【F:src/pages/Dashboard.js†L1-L53】

## Todo Management Flow

### 1. Fetch Todos

- `useTodos()` exposes `fetchTodos()` that calls `todoService.getTodos()` (`GET /to-do`). The response is expected to be `{ success, data }` and populates local state with the todo list.【F:src/hooks/useTodos.js†L1-L23】【F:src/services/api.js†L41-L49】

### 2. Create Todo

- `createTodo(todoData)` triggers `POST /to-do` with the new todo payload. Successful responses are prepended to local state for real-time UI updates.【F:src/hooks/useTodos.js†L25-L43】【F:src/services/api.js†L51-L59】

### 3. Update Todo

- `updateTodo(id, updates)` maps to `PUT /to-do/:id`, replacing the matching todo in state with the updated object returned by the API.【F:src/hooks/useTodos.js†L45-L63】【F:src/services/api.js†L61-L69】

### 4. Delete Todo

- `deleteTodo(id)` issues `DELETE /to-do/:id` and prunes the removed item from state on success.【F:src/hooks/useTodos.js†L65-L81】【F:src/services/api.js†L71-L79】

### 5. Toggle Completion

- `toggleTodo(id, completed)` is a convenience wrapper that calls `updateTodo` with a `completed` flag. Backend updates cascade to state automatically through the shared `updateTodo` handler.【F:src/hooks/useTodos.js†L83-L89】

### 6. Fetch Authenticated User Metadata

- `todoService.getUser()` calls `GET /user` on the Todo API. Although the current UI relies on the user object supplied by the auth context, this helper is available for components that need extended user metadata from the Todo service (e.g., future profile preferences).【F:src/services/api.js†L81-L87】【F:src/components/UserProfile.js†L1-L29】

## UI Composition

### App Shell (`src/App.js`)

- Wraps the entire router in `AuthProvider`, ensuring `useAuth()` is available globally.【F:src/App.js†L40-L53】
- Defines routes for public (`/login`) and protected (`/`) pages. Protected routes render the dashboard only when `isAuthenticated` is true, otherwise redirecting to login.【F:src/App.js†L9-L39】

### Login Page (`src/pages/Login.js`)

- Collects credentials and invokes `login()` from auth context. Displays errors from the Auth service to guide the user.【F:src/pages/Login.js†L1-L113】

### Dashboard (`src/pages/Dashboard.js`)

- Calls `fetchTodos()` after confirming authentication to load the initial todo list.【F:src/pages/Dashboard.js†L1-L42】
- Renders the todo form, list, and user profile components, passing the CRUD handlers from `useTodos()` down via props.【F:src/pages/Dashboard.js†L1-L97】

### Components

- **TodoForm** – Handles todo creation and editing, calling `createTodo`/`updateTodo` from the todos hook and closing the modal on success.【F:src/components/TodoForm.js†L1-L104】
- **TodoList** – Receives `todos` and `loading`, using hook callbacks to toggle and delete items while providing inline editing controls.【F:src/components/TodoList.js†L1-L92】
- **TodoItem** – Displays individual todo details with actions wired to update/delete handlers, and in-place editing via `TodoForm`.【F:src/components/TodoItem.js†L1-L102】
- **UserProfile** – Renders the authenticated user’s summary (initials, username, id) supplied by the auth context, and can be extended to consume Todo service metadata if needed.【F:src/components/UserProfile.js†L1-L29】

## Error Handling & Loading States

- Hooks manage `loading` and `error` flags to drive spinners and alerts across the UI. For example, `useTodos` sets `error` when API calls fail and components render fallback messaging accordingly.【F:src/hooks/useTodos.js†L1-L89】【F:src/pages/Dashboard.js†L53-L96】
- Authentication errors are stored after failed login attempts (`hasAttemptedLogin`) to avoid flashing error messages during the initial auth check on app load.【F:src/hooks/useAuth.js†L13-L55】

## Backend Contract Summary

| Service | Endpoint | Method | Consumed By |
| --- | --- | --- | --- |
| Auth | `/login` | POST | `authService.login()` → `useAuth.login()` → `Login` page submissions. |
| Auth | `/logout` | POST | `authService.logout()` → `useAuth.logout()` → UI logout controls. |
| Auth | `/is-logged-in` | GET | `authService.checkAuth()` → `useAuth.checkAuthStatus()` on app bootstrap. |
| Auth | `/health` | GET | `authService.healthCheck()` for health dashboards or uptime checks. |
| Todo | `/to-do` | GET | `todoService.getTodos()` → `useTodos.fetchTodos()` in dashboard initialization. |
| Todo | `/to-do/:id` | GET | `todoService.getTodo()` for detail views (helper available for future use). |
| Todo | `/to-do` | POST | `todoService.createTodo()` → `useTodos.createTodo()` in `TodoForm`. |
| Todo | `/to-do/:id` | PUT | `todoService.updateTodo()` → `useTodos.updateTodo()` / `toggleTodo()`. |
| Todo | `/to-do/:id` | DELETE | `todoService.deleteTodo()` → `useTodos.deleteTodo()` in list actions. |
| Todo | `/user` | GET | `todoService.getUser()` helper for user metadata beyond auth payload. |
| Todo | `/health` | GET | `todoService.healthCheck()` for operational monitoring. |

## Extending the Frontend

When adding new features that require backend integration:

1. **Define/Reuse Endpoints** – Ensure the backend exposes the necessary REST endpoints. Update `src/services/api.js` with new helper functions that call these endpoints using the configured axios clients.【F:src/services/api.js†L1-L89】
2. **Encapsulate in Hooks** – Add logic to a custom hook (e.g., extend `useTodos` or create a new hook) to manage state, side effects, and error handling around the new API calls.【F:src/hooks/useTodos.js†L1-L89】
3. **Compose UI** – Build or update components/pages to consume the hook’s state and invoke the API helpers through callbacks.【F:src/pages/Dashboard.js†L1-L97】【F:src/components/TodoList.js†L1-L92】
4. **Update Docs** – Document new endpoints in this guide and the root README to keep consumers aware of backend contracts.

## Related Files

- `src/services/api.js` – Centralized axios setup and endpoint wrappers.
- `src/hooks/useAuth.js` – Authentication context and session management.
- `src/hooks/useTodos.js` – Todo CRUD state handling.
- `src/pages/Login.js`, `src/pages/Dashboard.js` – Entry points for auth and todo experiences.
- `src/components/*` – Presentational and interactive pieces composing the UI.

Referencing these modules will help maintainers trace how UI interactions flow through hooks to the backend services and back into the rendered state.
