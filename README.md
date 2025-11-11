## HTTP Client & Services
- Eén gedeelde Axios client: `src/services/api.js`
  - Base URL uit `.env` (`VITE_API_URL`)
  - `novi-education-project-id` header uit `.env` (`VITE_NOVI_PROJECT_ID`)
  - `timeout: 10000`
  - Request interceptor: voegt `Authorization: Bearer <token>` toe als aanwezig
  - Response interceptor: bij `401` → token verwijderen + redirect naar `/login`
- Domeinservices (DRY) in `src/services/`:
  - `authService` (login, register)
  - `activityService` (UI “activities” → API `/events`)
  - `lessonService`, `messageService`, `homeworkService`, `commentService`,
    `profileService`, `enrollmentService`
