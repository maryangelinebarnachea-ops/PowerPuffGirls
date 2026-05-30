# NUluminate — Vibe Coding Rules, Contexts, and Flow

# 1. Core Development Philosophy

## Main Principle

> “Simple systems survive longer.”

The system must prioritize:

* Stability
* Readability
* Maintainability
* Predictable behavior

Avoid:

* Premature optimization
* Overengineering
* Complex abstractions
* Unnecessary frameworks

```plaintext
Student Registration
→ Authentication
→ Wellness Check-In
→ Faculty Analytics
```

Everything outside this flow is considered future scope.

---

# 2. Architecture Context Rules

# A. Frontend Context (React + TypeScript)

## Frontend Responsibility

The frontend is ONLY responsible for:

* UI rendering
* Form handling
* API communication
* Session storage
* User navigation

The frontend MUST NOT:

* Perform business logic
* Decide authorization rules
* Store sensitive data
* Trust client-side validation alone

---

## Frontend Folder Context

```plaintext
src/
├── api/
├── components/
├── pages/
├── hooks/
├── layouts/
├── context/
├── routes/
├── types/
├── utils/
└── constants/
```

---

## Frontend Rules

### Rule 1 — Reusable Components Only

Every UI element should be reusable.

✅ GOOD

```plaintext
Button.tsx
InputField.tsx
Modal.tsx
Card.tsx
```

❌ BAD

```plaintext
StudentSubmitButton.tsx
FacultyBlueCard.tsx
```

---

### Rule 2 — Strict Type Safety

All API contracts must use TypeScript interfaces.

Example:

```typescript
type MoodType =
  | 'HAPPY'
  | 'OKAY'
  | 'STRESSED'
  | 'EXHAUSTED';

interface CheckInPayload {
  mood: MoodType;
  stressLevel: 1 | 2 | 3 | 4 | 5;
  isAnonymous: boolean;
}
```

No usage of:

```typescript
any
```

---

### Rule 3 — Centralized API Layer

All HTTP requests must go through:

```plaintext
src/api/
```

Example:

```plaintext
authApi.ts
checkInApi.ts
dashboardApi.ts
```

Avoid direct Axios calls inside pages/components.

---

### Rule 4 — Thin Pages

Pages should:

* Arrange components
* Trigger hooks
* Handle navigation

Pages MUST NOT contain:

* Complex business logic
* Data transformation logic

---

### Rule 5 — Hooks for Shared Logic

Shared frontend logic belongs in hooks.

Example:

```plaintext
useAuth.ts
useCheckIn.ts
useDashboard.ts
```

---

# B. Backend Context (Spring Boot)

## Backend Responsibility

The backend owns:

* Authentication
* Authorization
* Validation
* Business rules
* Data security
* Analytics calculations

Frontend is considered untrusted.

---

## Backend Folder Context

```plaintext
src/main/java/com/nuluminate
├── controller/
├── service/
├── service/impl/
├── repository/
├── entity/
├── dto/
├── validator/
├── strategy/
├── security/
├── config/
├── exception/
└── util/
```

---

# 3. Backend Coding Rules

# A. Layered Architecture Enforcement

## Flow Rule

The request flow MUST always follow:

```plaintext
Controller
→ Service
→ Repository
→ Database
```

Never skip layers.

---

# B. Controller Rules

Controllers should:

* Accept requests
* Validate DTOs
* Return responses
* Delegate logic to services

Controllers MUST NOT:

* Query repositories directly
* Contain analytics logic
* Hash passwords
* Perform calculations

---

## GOOD Example

```java
@PostMapping("/checkins")
public ResponseEntity<?> create(
        @RequestBody CheckInRequestDTO dto) {

    checkInService.submit(dto);

    return ResponseEntity.ok().build();
}
```

---

# C. Service Rules

Services contain:

* Business logic
* Validation orchestration
* Security checks
* Data transformation

Services MUST:

* Be interface-driven
* Follow SRP (Single Responsibility Principle)

---

## GOOD Example

```java
public interface CheckInService {
    void submit(CheckInRequestDTO dto);
}
```

---

# D. Repository Rules

Repositories ONLY:

* Access database
* Execute queries
* Return entities

Repositories MUST NOT:

* Contain business rules
* Perform calculations
* Handle DTO mapping

---

# E. DTO Rules

DTOs are mandatory.

Never expose entities directly to APIs.

Example:

```plaintext
LoginRequestDTO
CheckInRequestDTO
DashboardResponseDTO
```

---

# 4. Domain & OOP Rules

# A. Encapsulation Rule

Validation belongs inside domain services.

Example:

```plaintext
NUEmailValidator
StressLevelValidator
```

Avoid duplicated validation logic.

---

# B. Interface-Driven Design

Every major service must have:

* Interface
* Implementation

Example:

```plaintext
AuthService
AuthServiceImpl
```

Purpose:

* Easier testing
* Scalability
* Loose coupling

---

# C. Strategy Pattern Context

Analytics calculations MUST use:

```plaintext
TrendStrategy
```

Purpose:

* Modular analytics
* Easy future extension

Example:

```plaintext
MoodTrendStrategy
StressTrendStrategy
```

---

# D. Anonymous Data Rule

Critical system rule:

```plaintext
If isAnonymous == true
→ user_id MUST be NULL
```

This logic MUST exist ONLY in backend service layer.

Never trust frontend anonymity.

---

# 5. Security Context Rules

# A. Authentication Rules

Use:

* Spring Security
* JWT Authentication
* BCrypt hashing

Passwords MUST NEVER:

* Be stored in plaintext
* Be logged
* Be returned in responses

---

# B. Authorization Rules

Role enforcement:

```plaintext
STUDENT
FACULTY
ADMIN
```

Protected endpoints:

```plaintext
/api/v1/faculty/**
```

---

# C. Validation Rules

Backend validation is REQUIRED even if frontend validates.

Use:

```java
@NotBlank
@Email
@Min(1)
@Max(5)
```

---

# D. Email Restriction Rule

Registration must use:

```plaintext
@nu-laguna.edu.ph
```

Validation must be centralized through:

```plaintext
NUEmailValidator
```

---

# 6. Database Rules

# A. Entity Rules

Entities should:

* Represent database structure only
* Avoid complex business logic

---

# B. Timestamp Rules

All major entities must include:

```plaintext
createdAt
updatedAt
```

---

# C. Relationship Rules

```plaintext
User
1 → Many
WellnessCheckIn
```

Anonymous entries:

```plaintext
user_id = NULL
```

---

# D. Query Rules

Faculty analytics queries MUST:

* Use aggregate calculations only
* Never expose anonymous identity data

---

# 7. API Standards & Contracts

# A. JSON Response Standard

## Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

---

## Error Response

```json
{
  "success": false,
  "message": "Validation failed"
}
```

---

# B. REST Standards

Use:

```plaintext
GET     → Retrieve
POST    → Create
PUT     → Update
DELETE  → Remove
```

Avoid:

```plaintext
/api/getUsers
/api/createCheckin
```

Use:

```plaintext
/api/v1/checkins
```

---

# 8. Development Flow (Strict Order)

# Phase 1 — Foundation Setup

### Backend

* Spring Boot setup
* H2 configuration
* Entity creation
* Repository creation

### Frontend

* React + Vite setup
* Tailwind setup
* Routing setup

---

# Phase 2 — Authentication Module

Build completely before anything else.

Features:

* Register
* Login
* JWT generation
* Role protection

---

# Phase 3 — Wellness Check-In

Features:

* Submit check-in
* Anonymous submission logic
* History retrieval

---

# Phase 4 — Faculty Dashboard

Features:

* Mood distribution
* Stress averages
* Trend calculations

---

# Phase 5 — Validation & Hardening

* Global exception handling
* Input validation
* Security testing
* API cleanup

---

# 9. Git Workflow Rules

# Branch Naming

```plaintext
main
develop
feature/authentication
feature/checkin-module
feature/dashboard
```

---

# Commit Naming

```plaintext
feat: add login endpoint
fix: resolve anonymous check-in bug
refactor: simplify trend strategy
```

---

# Pull Request Rules

PRs must:

* Be small
* Be testable
* Focus on one feature only

---

# 10. UI/UX Rules

# A. Design Philosophy

Prioritize:

* Clarity
* Simplicity
* Accessibility

Avoid:

* Heavy animations
* Fancy transitions
* Complex dashboards

---

# B. Form Rules

Every form must:

* Show validation messages
* Prevent duplicate submissions
* Disable invalid actions

---

# C. Dashboard Rules

Dashboard must:

* Load fast
* Show summarized analytics
* Avoid clutter

---

# 11. Testing Rules

# Backend Testing

Required:

* Service tests
* Repository tests
* API endpoint tests

---

# Frontend Testing

Required:

* Form validation tests
* Component rendering tests

---

# 12. Team Way-of-Working Rules

# Rule 1 — Finish Features Completely

Never leave half-built modules.

Correct order:

```plaintext
Authentication → DONE
Check-In → DONE
Dashboard → DONE
```

---

# Rule 2 — Test Immediately

Every feature must be tested before merge.

---

# Rule 3 — Keep Code Predictable

Future developers should understand the code quickly.

Code readability is more important than cleverness.

---
