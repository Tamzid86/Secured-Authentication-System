Node.js Cybersecurity Authentication Module

A secure authentication system built with Node.js and PostgreSQL, designed to demonstrate strong backend development and cybersecurity best practices. This project implements signup, login, JWT-based authentication, refresh token rotation, middleware for route protection, rate limiting, and security event logging.

Features
1. Signup / Registration

Role-based account creation (admin, service, viewer)

Input validation using Zod

Passwords securely hashed with bcrypt

Prevents duplicate accounts

Easily restricted for admin-only registration in production

2. Login

Validates email and password

Generates access tokens (short-lived) and refresh tokens (long-lived)

Refresh tokens are hashed before storing in DB

Supports secure, audit-ready login flow

3. Refresh Token Flow

Allows access token renewal without re-login

Implements token rotation to prevent replay attacks

Revokes old refresh tokens automatically

Protects against stolen or reused refresh tokens

4. Authentication Middleware

Protects API routes using JWT access tokens

Supports role-based access control

Attaches user info to requests for secure processing

5. Security Hardening

Rate limiting on login, registration, and refresh endpoints using Redis

Logs security events to database:

Failed login attempts

Refresh token reuse

Unauthorized access attempts

Designed with cybersecurity principles in mind

6. Database

PostgreSQL used for user and token management

Tables:

users – stores user credentials and roles

refresh_tokens – stores hashed refresh tokens

security_events – logs security-relevant actions