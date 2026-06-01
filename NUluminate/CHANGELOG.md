# Changelog

## [1.0.0] - 2026-06-02

### Added
- User registration with NU email validation
- BCrypt password hashing
- Wellness check-in with mood and stress level
- Anonymous check-in option
- Personal check-in history
- Faculty dashboard with non-anonymous check-ins
- AI wellness chat
- BaseEntity inheritance
- Layered architecture: Controller -> Service -> Repository -> Entity

### Fixed
- CORS configuration
- UserId from X-User-Id header instead of hardcoded value
- Anonymous check-ins filtered from faculty dashboard

### Security
- Passwords hashed with BCrypt
- Email restricted to NU student domain only
