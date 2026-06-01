# NUluminate - Student Wellness App

> A mental wellness check-in platform for NU Laguna students and faculty.

---

## Team - PowerPuff Girls
- Cardeno Faye
- Jagunap Janelle
- Nono Mary Angeline B.

---

## Tech Stack
- Frontend: React + TypeScript + Vite (port 5175)
- Backend: Spring Boot 3.2 + Java 17 (port 8080)
- Database: PostgreSQL

---

## Features
- Student registration and login (NU email only - @student.nu-laguna.edu.ph)
- Daily wellness check-in (mood + stress level 1-5)
- Anonymous check-in option
- Personal check-in history
- Faculty dashboard (non-anonymous check-ins only)
- AI-powered wellness chat
- Protected routes (redirect to login if not authenticated)

---

## Architecture

Follows strict layered architecture:

  Controller -> Service Interface -> Service Impl -> Repository -> Entity

Package structure:
  com.nuluminate
  controller/   - REST endpoints
  service/      - Business logic interfaces
  service/impl/ - Business logic implementations
  repository/   - Spring Data JPA repositories
  entity/       - JPA entities
  dto/          - Request and response objects
  validator/    - Email validation

---

## OOP Concepts Applied

### Encapsulation
All entity fields (User, WellnessCheckIn) are private with public getters and setters.

### Abstraction
AuthService, CheckInService, and EmailValidator are defined as interfaces.
Controllers depend on interfaces, not implementations.

### Inheritance
BaseEntity (annotated with @MappedSuperclass) provides the shared ID field.
User and WellnessCheckIn both extend BaseEntity.

### Polymorphism
NUEmailValidator implements the EmailValidator interface.
The validator can be swapped without changing any service code.

---

### SOLID Principles
- Single Responsibility: each class has one job
- Dependency Inversion: constructor injection of interfaces throughout

---

## API Endpoints

### Auth
  POST /api/v1/auth/register   - Register new student
  POST /api/v1/auth/login      - Login

### Check-In
  POST /api/v1/checkins              - Submit a check-in
  GET  /api/v1/checkins/my-history   - Get personal history

### Faculty
  GET  /api/v1/faculty/dashboard     - Get all non-anonymous check-ins

---

## How to Run

### Backend
  cd backend
  .\\mvnw spring-boot:run

### Frontend
  cd frontend
  npm install
  npm run dev

---

### Requirements
- Java 17+
- Node.js 18+
- PostgreSQL running on port 5432

---

## Testing
Run backend unit tests:
  cd backend
  .\\mvnw test

Tests cover:
- Valid NU student email accepted
- Gmail and other domains rejected
- Null and empty email handled

---

## Security
- Passwords hashed with BCrypt
- Email restricted to @student.nu-laguna.edu.ph domain
- Anonymous check-ins excluded from faculty view

---