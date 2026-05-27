# NUluminate - Low-Level Technical Requirements

## 1. System Technology Stack
- **Frontend Architecture:** React (v18+) powered by TypeScript, built using Vite, styled via Tailwind CSS.
- **Backend Architecture:** Java 17+, Spring Boot Framework (Spring Web, Spring Data JPA).
- **Database Layer:** H2 In-Memory Database (for seamless local development, testing, and zero-configuration setup).

## 2. Database Schema & Object-Oriented Domain Models (Java)

### User Entity (`User.java`)
- `id`: Long (Primary Key, Auto-Incremented)
- `email`: String (Unique, Indexed, Strict domain restriction)
- `password`: String (Stored as a secured hash)
- `role`: Enum (`STUDENT`, `FACULTY`, `ADMIN`)

### WellnessCheckIn Entity (`WellnessCheckIn.java`)
- `id`: Long (Primary Key, Auto-Incremented)
- `mood`: Enum (`HAPPY`, `OKAY`, `STRESSED`, `EXHAUSTED`)
- `stressLevel`: Integer (Validated range from 1 to 5)
- `isAnonymous`: Boolean (Flag determining identity tracking)
- `submittedAt`: Instant (Timestamp recording entry creation)
- `user`: Many-to-One Relationship with User Entity (Nullable. **Strict Rule:** If `isAnonymous` is true, this foreign key relation MUST explicitly save as `NULL` in the database to guarantee student anonymity).

## 3. Core Business Logic & Guardrails (OOP Principles)
- **Domain Validation via Encapsulation:** Registration requires an interface `EmailValidator` implemented by `NUEmailValidator`. It enforces that all registration emails strictly terminate with the university's approved domain string (`@nu-laguna.edu.ph`).
- **Data Isolation:** Implement a `TrendStrategy` pattern for analytics. Faculty services can query aggregate check-in metrics (e.g., mood percentages, average stress levels) but are physically restricted from querying user identity parameters linked to anonymous entries.

## 4. Frontend Type Contracts (TypeScript)
Every data model shared between backend APIs and the frontend must be rigidly typed to prevent runtime failures.
- `type MoodType = 'HAPPY' | 'OKAY' | 'STRESSED' | 'EXHAUSTED';`
- `type StressLevelType = 1 | 2 | 3 | 4 | 5;`
- `interface CheckInPayload { mood: MoodType; stressLevel: StressLevelType; isAnonymous: boolean; }`

## 5. REST API Architecture Contracts
All endpoints must explicitly handle and return structured JSON payloads:

| HTTP Method | API Endpoint | Access Level | Payload Expectation (JSON) | System Response Behavior |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public | `{ "email": "", "password": "" }` | Validates domain extension, registers user, hashes password. |
| `POST` | `/api/v1/auth/login` | Public | `{ "email": "", "password": "" }` | Authenticates user credentials and provisions access session. |
| `POST` | `/api/v1/checkins` | Student | `{ "mood": "", "stressLevel": 0, "isAnonymous": true }` | Records entry. Sanitizes user relations if anonymized. |
| `GET` | `/api/v1/checkins/my-history` | Student | None | Pulls historically logged non-anonymous user check-ins. |
| `GET` | `/api/v1/faculty/dashboard` | Faculty / Admin | None | Delivers aggregated statistical math (averages, frequencies). |