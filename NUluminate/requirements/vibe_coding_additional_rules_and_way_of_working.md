# NUluminate — Vibe Coding Additional Rules & Way-of-Working

> Derived from Technical Requirements & Core Rules

---

## 1. Naming & File Conventions

### Backend (Java)

```java
// Entities — singular PascalCase
User.java
WellnessCheckIn.java

// DTOs — always suffixed
LoginRequestDTO.java
CheckInRequestDTO.java
DashboardResponseDTO.java

// Services — always interface + impl pair
AuthService.java          // interface
AuthServiceImpl.java      // implementation
CheckInService.java
CheckInServiceImpl.java

// Validators — always suffixed
NUEmailValidator.java     // implements EmailValidator

// Strategies
MoodTrendStrategy.java    // implements TrendStrategy
StressTrendStrategy.java
```

### Frontend (TypeScript / React)

```plaintext
// Components — generic, reusable, PascalCase
Button.tsx
InputField.tsx
Modal.tsx
Card.tsx

// API layer — suffixed per domain
authApi.ts
checkInApi.ts
dashboardApi.ts

// Hooks — prefixed with "use"
useAuth.ts
useCheckIn.ts
useDashboard.ts

// Types — co-located in types/
types/auth.ts
types/checkin.ts
types/dashboard.ts
```

---

## 2. TypeScript Type Contracts (enforced, no exceptions)

```typescript
type MoodType = 'HAPPY' | 'OKAY' | 'STRESSED' | 'EXHAUSTED';
type StressLevelType = 1 | 2 | 3 | 4 | 5;
type UserRole = 'STUDENT' | 'FACULTY' | 'ADMIN';

interface CheckInPayload {
  mood: MoodType;
  stressLevel: StressLevelType;
  isAnonymous: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
```

> **Hard rule:** `any` is banned across the entire codebase. TypeScript strict mode must be enabled in `tsconfig.json`. All API response shapes must map to typed interfaces, never inferred inline.

---

## 3. API Layer Rules (centralized, no exceptions)

All HTTP calls must live inside `src/api/`. No Axios or fetch calls inside components or pages.

```typescript
// src/api/checkInApi.ts
import axios from 'axios';
import { CheckInPayload, ApiResponse } from '../types/checkin';

export const submitCheckIn = async (
  payload: CheckInPayload
): Promise<ApiResponse<void>> => {
  const { data } = await axios.post('/api/v1/checkins', payload);
  return data;
};
```

---

## 4. Anonymity Enforcement (critical system rule)

> **Frontend MUST send `isAnonymous: true/false` only.** The backend service layer is the sole authority that decides whether to NULL out the `user_id` FK. Frontend must never attempt to strip identity fields before submission.

```java
// Backend — CheckInServiceImpl.java
WellnessCheckIn entry = new WellnessCheckIn();
entry.setMood(dto.getMood());
entry.setStressLevel(dto.getStressLevel());
entry.setIsAnonymous(dto.isAnonymous());
entry.setUser(dto.isAnonymous() ? null : currentUser); // ← ONLY here
entry.setSubmittedAt(Instant.now());
checkInRepository.save(entry);
```

---

## 5. Email Validation Rule

```java
// EmailValidator.java (interface)
public interface EmailValidator {
    boolean isValid(String email);
}

// NUEmailValidator.java (implementation)
@Component
public class NUEmailValidator implements EmailValidator {
    private static final String ALLOWED_DOMAIN = "@nu-laguna.edu.ph";

    @Override
    public boolean isValid(String email) {
        return email != null && email.endsWith(ALLOWED_DOMAIN);
    }
}
```

> This validator must be injected — never inline the domain string check inside a controller or service directly.

---

## 6. Response Structure Standard

**Success**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

**Error**

```json
{
  "success": false,
  "message": "Validation failed"
}
```

| Rule | Detail |
| :--- | :--- |
| No entity leaks | DTOs only in responses. Never expose `User.java` or `WellnessCheckIn.java` directly. |
| Password safety | Never returned, never logged, always BCrypt-hashed before persistence. |

---

## 7. Analytics Query Guardrails

```sql
-- Faculty dashboard queries — aggregate only, never identity
SELECT mood, COUNT(*) as count
FROM wellness_check_in
GROUP BY mood;

SELECT AVG(stress_level) as avgStress
FROM wellness_check_in;

-- NEVER:
SELECT wc.*, u.email FROM wellness_check_in wc
JOIN user u ON wc.user_id = u.id
WHERE wc.is_anonymous = true;  -- FORBIDDEN
```

> **Strategy pattern required:** All analytics must be routed through `TrendStrategy` implementations. No raw aggregate queries inside controllers.

---

## 8. Git Branch & Commit Standards

```plaintext
# Branches
main
develop
feature/authentication
feature/checkin-module
feature/faculty-dashboard
```

```plaintext
# Commit format — conventional commits
feat: add JWT authentication filter
feat: implement anonymous check-in null guard
fix: resolve stress level validation edge case
refactor: extract MoodTrendStrategy from service
test: add NUEmailValidator unit tests
chore: configure H2 datasource properties
```

| Rule | Detail |
| :--- | :--- |
| PR rule | One feature per PR. Must be testable end-to-end before merge into `develop`. |
| Merge target | All feature branches merge into `develop`. Only completed, tested milestones promote to `main`. |

---

## 9. Build Order — Enforced Phase Sequence

> **Never build out of order. No work on Phase 3 begins until Phase 2 passes all tests. This is non-negotiable.**

| Phase | Name | Scope |
| :---: | :--- | :--- |
| 1 | Foundation | Spring Boot + H2 setup, entity creation, React + Vite + Tailwind, routing scaffold |
| 2 | Authentication module | Register, login, JWT generation, role-based route protection — fully done before phase 3 |
| 3 | Wellness check-in module | Submit check-in, anonymity null guard, history retrieval for non-anonymous entries |
| 4 | Faculty dashboard | Mood distribution, stress averages, trend strategy calculations — faculty/admin access only |
| 5 | Hardening | Global exception handler, input validation, security testing, API cleanup |

---

## 10. Validation Placement Rules

| Concern | Owned by | Not permitted in |
| :--- | :--- | :--- |
| Email domain check | `NUEmailValidator` | Controller, page component |
| Stress level range (1–5) | Backend `@Min(1) @Max(5)` | Service or repository layer |
| Anonymity null guard | `CheckInServiceImpl` | Frontend, controller, repository |
| Role authorization | Spring Security config | Service or DTO layer |
| Password hashing | `AuthServiceImpl` via BCrypt | Controller, entity, DB trigger |

---

## 11. What Not to Build (out of scope)

| Category | Rule |
| :--- | :--- |
| Features | No email/notification system, profile edit, admin CRUD UI, file uploads, external OAuth, or real-time features. |
| Database | H2 in-memory only. No migration to MySQL or PostgreSQL until explicitly scoped. |
| Frontend | No complex animations, no fancy transitions. Clarity and accessibility first. |
| Code style | Readability over cleverness. If a future developer can't understand it in 30 seconds, rewrite it. |
