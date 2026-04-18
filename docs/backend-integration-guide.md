# E-Recruitment Backend Integration Guide

## 1. Purpose
This document describes the current backend state of the E-Recruitment system so the frontend developer can integrate against stable APIs while backend and frontend continue in parallel.

This is not a final handoff document. It is a working integration reference.

---

## 2. Tech Stack
- Java 17
- Spring Boot 3
- Spring Security
- JWT authentication
- Spring Data JPA / Hibernate
- PostgreSQL
- Maven

---

## 3. Current Backend Modules
The backend currently includes these modules:

- Authentication and authorization
- User and role management
- Candidate profile
- Recruiter profile
- Job offer management
- Job application management
- Notifications

---

## 4. Roles
The system uses three roles:

- `ROLE_ADMIN`
- `ROLE_RECRUITER`
- `ROLE_CANDIDATE`

At the current stage, the main flows implemented are for:
- Candidate
- Recruiter

Admin-specific business endpoints are not yet implemented.

---

## 5. Authentication Model
The backend uses JWT-based stateless authentication.

### Auth flow
1. User registers as candidate or recruiter
2. User logs in using email and password
3. Backend returns a JWT token
4. Frontend sends the token in the `Authorization` header
5. Protected endpoints read the authenticated user from the security context

### Authorization header format
```http
Authorization: Bearer <JWT_TOKEN>
```

---

## 6. Base URL
Local development base URL:

```text
http://localhost:8080
```

All API routes currently start with:

```text
/api
```

---

## 7. Implemented Endpoints

## 7.1 Authentication

### Register candidate
**POST** `/api/auth/register/candidate`

Request body:
```json
{
  "firstName": "Massine",
  "lastName": "Amakhtari",
  "email": "massine@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "userId": 1,
  "firstName": "Massine",
  "lastName": "Amakhtari",
  "email": "massine@example.com",
  "role": "ROLE_CANDIDATE",
  "token": "<jwt>",
  "message": "Candidate registered successfully."
}
```

### Register recruiter
**POST** `/api/auth/register/recruiter`

Request body:
```json
{
  "firstName": "Amine",
  "lastName": "Moussaid",
  "email": "amine@example.com",
  "password": "password123",
  "companyName": "TechCorp"
}
```

Response:
```json
{
  "userId": 2,
  "firstName": "Amine",
  "lastName": "Moussaid",
  "email": "amine@example.com",
  "role": "ROLE_RECRUITER",
  "token": "<jwt>",
  "message": "Recruiter registered successfully."
}
```

### Login
**POST** `/api/auth/login`

Request body:
```json
{
  "email": "massine@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "userId": 1,
  "firstName": "Massine",
  "lastName": "Amakhtari",
  "email": "massine@example.com",
  "role": "ROLE_CANDIDATE",
  "token": "<jwt>",
  "message": "Login successful."
}
```

---

## 7.2 Current user

### Get current authenticated user
**GET** `/api/users/me`

Auth required: yes

Headers:
```http
Authorization: Bearer <JWT_TOKEN>
```

Response:
```json
{
  "id": 1,
  "firstName": "Massine",
  "lastName": "Amakhtari",
  "email": "massine@example.com",
  "role": "ROLE_CANDIDATE"
}
```

Frontend use:
- initialize user session after login
- restore session on app reload
- route users by role

---

## 7.3 Job Offers

### Get all active job offers
**GET** `/api/job-offers`

Public endpoint.

Response:
```json
[
  {
    "id": 2,
    "title": "Java Backend Developer",
    "description": "We are looking for a backend developer with Spring Boot experience.",
    "contractType": "CDI",
    "location": "Casablanca",
    "salary": 12000.00,
    "active": true,
    "createdAt": "2026-04-17T20:25:37.131498",
    "recruiterId": 2,
    "recruiterEmail": "amine@example.com"
  }
]
```

### Get job offer by id
**GET** `/api/job-offers/{id}`

Public endpoint.

### Get recruiter's own job offers
**GET** `/api/job-offers/me`

Auth required: recruiter only

### Create job offer
**POST** `/api/job-offers`

Auth required: recruiter only

Request body:
```json
{
  "title": "Java Backend Developer",
  "description": "We are looking for a backend developer with Spring Boot experience.",
  "contractType": "CDI",
  "location": "Casablanca",
  "salary": 12000,
  "active": true
}
```

### Update job offer
**PUT** `/api/job-offers/{id}`

Auth required: recruiter only
Only the recruiter who owns the offer can update it.

### Delete job offer
**DELETE** `/api/job-offers/{id}`

Auth required: recruiter only
Only the recruiter who owns the offer can delete it.

---

## 7.4 Applications

### Apply to a job offer
**POST** `/api/applications/job-offers/{jobOfferId}`

Auth required: candidate only

Request body:
```json
{
  "coverLetter": "I am very interested in this opportunity and believe my Spring Boot skills are a strong fit."
}
```

Response:
```json
{
  "id": 1,
  "coverLetter": "I am very interested in this opportunity and believe my Spring Boot skills are a strong fit.",
  "status": "PENDING",
  "appliedAt": "2026-04-17T20:42:22.002175",
  "candidateId": 1,
  "candidateEmail": "massine@example.com",
  "jobOfferId": 2,
  "jobOfferTitle": "Java Backend Developer"
}
```

Important rule:
- A candidate cannot apply twice to the same job offer
- Duplicate apply returns `409 Conflict`

### Get my applications
**GET** `/api/applications/me`

Auth required: candidate only

### Get one of my applications by id
**GET** `/api/applications/me/{applicationId}`

Auth required: candidate only
Can only access own applications.

### Get all applications across recruiter's offers
**GET** `/api/applications/recruiter`

Auth required: recruiter only

### Get applications for a specific recruiter-owned job offer
**GET** `/api/applications/recruiter/job-offers/{jobOfferId}`

Auth required: recruiter only
Can only access applications for job offers owned by the authenticated recruiter.

### Update application status
**PATCH** `/api/applications/{applicationId}/status`

Auth required: recruiter only
Only the recruiter who owns the related job offer can update the status.

Request body:
```json
{
  "status": "IN_REVIEW"
}
```

Allowed statuses:
- `PENDING`
- `IN_REVIEW`
- `ACCEPTED`
- `REJECTED`

---

## 7.5 Notifications

Notifications are stored in the database and exposed through REST endpoints.

### Notification triggers currently implemented
- Candidate applies to a job offer -> recruiter receives `NEW_APPLICATION`
- Recruiter updates application status -> candidate receives `APPLICATION_STATUS_UPDATED`

### Get all my notifications
**GET** `/api/notifications`

Auth required: yes

### Get unread notifications
**GET** `/api/notifications/unread`

Auth required: yes

### Mark one notification as read
**PATCH** `/api/notifications/{notificationId}/read`

Auth required: yes
Can only mark own notifications.

### Mark all my notifications as read
**PATCH** `/api/notifications/read-all`

Auth required: yes

Response: `204 No Content`

Example notification response:
```json
{
  "id": 2,
  "message": "Your application for 'Java Backend Developer' has been updated to status: ACCEPTED.",
  "type": "APPLICATION_STATUS_UPDATED",
  "read": true,
  "createdAt": "2026-04-17T21:28:35.306128",
  "recipientId": 1,
  "recipientEmail": "massine@example.com"
}
```

---

## 8. Security Rules Summary

## Public routes
- `POST /api/auth/register/candidate`
- `POST /api/auth/register/recruiter`
- `POST /api/auth/login`
- `GET /api/job-offers`
- `GET /api/job-offers/{id}`

## Authenticated routes
- `GET /api/users/me`
- `/api/notifications/**`

## Candidate-only routes
- `POST /api/applications/job-offers/{jobOfferId}`
- `GET /api/applications/me`
- `GET /api/applications/me/{applicationId}`

## Recruiter-only routes
- `GET /api/job-offers/me`
- `POST /api/job-offers`
- `PUT /api/job-offers/{id}`
- `DELETE /api/job-offers/{id}`
- `GET /api/applications/recruiter`
- `GET /api/applications/recruiter/job-offers/{jobOfferId}`
- `PATCH /api/applications/{applicationId}/status`

---

## 9. Main Business Rules

### Authentication
- login is email/password based
- password is encrypted with BCrypt
- backend returns JWT token on register and login

### Job offers
- only recruiters can create, update, delete offers
- only the owner recruiter can modify or delete a given offer
- public listing returns only active job offers

### Applications
- only candidates can apply
- candidate cannot apply twice to the same offer
- candidate can only access their own applications
- recruiter can only access applications related to their own offers

### Notifications
- users can only read and update their own notifications

---

## 10. Current Response / Error Behavior

The backend uses `ProblemDetail` for several business errors.

Examples:

### Duplicate application
```json
{
  "type": "about:blank",
  "title": "Duplicate application",
  "status": 409,
  "detail": "You have already applied to this job offer.",
  "instance": "/api/applications/job-offers/2"
}
```

### Forbidden operation
```json
{
  "type": "about:blank",
  "title": "Forbidden operation",
  "status": 403,
  "detail": "You can only update your own notifications.",
  "instance": "/api/notifications/1/read"
}
```

### Resource not found
```json
{
  "type": "about:blank",
  "title": "Resource not found",
  "status": 404,
  "detail": "Job offer not found",
  "instance": "/api/job-offers/99"
}
```

Note: unauthenticated protected requests currently return `403` in the current configuration. This can be refined later to return `401` with a dedicated authentication entry point if needed.

---

## 11. Suggested Frontend Integration Flow

## Public visitor
- fetch job offers list
- view job offer detail
- register / login

## Candidate app flow
1. register or login
2. store JWT
3. call `/api/users/me`
4. show candidate dashboard
5. browse job offers
6. apply to an offer
7. view own applications
8. view notifications

## Recruiter app flow
1. register or login
2. store JWT
3. call `/api/users/me`
4. show recruiter dashboard
5. create/manage job offers
6. view applications across offers
7. view applications for one specific offer
8. update application statuses
9. view notifications

---

## 12. Frontend Integration Recommendations

### Token storage
Frontend developer can begin with local storage for development:
- `token`
- `user`

Later this can be upgraded if needed.

### API client
Recommended frontend behavior:
- attach `Authorization: Bearer <token>` automatically on authenticated requests
- centralize 403 handling
- redirect to login when token is missing or invalid

### Session bootstrap
On app load:
1. read token from storage
2. if token exists, call `/api/users/me`
3. if success, restore session
4. if failure, clear token and redirect to login

---

## 13. Known Gaps / Next Backend Improvements
These are not blockers for current frontend work, but they are not yet implemented:

- admin business endpoints
- pagination
- filtering by application status
- recruiter dashboard stats
- CV file upload
- company profile management endpoints beyond registration foundation
- candidate profile edit endpoints
- refresh token flow
- custom `401 Unauthorized` entry point
- OpenAPI / Swagger documentation
- automated tests beyond manual API validation

---

## 14. Suggested Collaboration Workflow
Because backend and frontend will continue in parallel, the recommended collaboration loop is:

1. Frontend integrates against this document and current endpoints
2. Any missing contract is raised quickly
3. Backend adjusts DTOs/endpoints only in a controlled way
4. Breaking changes should be documented before merging

Recommended rule:
- do not silently rename fields already consumed by frontend
- document any new endpoint or changed response structure immediately

---

## 15. Suggested Immediate Next Backend Tasks
If backend work continues in parallel, the next high-value tasks are:

- candidate profile read/update endpoints
- recruiter company profile read/update endpoints
- pagination for offers/applications/notifications
- filtering applications by status
- recruiter dashboard stats
- OpenAPI documentation
- seed/demo data strategy for frontend dev environment

---

## 16. Quick Endpoint Checklist

### Auth
- [x] register candidate
- [x] register recruiter
- [x] login
- [x] current user

### Job Offers
- [x] list public offers
- [x] get public offer detail
- [x] create offer
- [x] update offer
- [x] delete offer
- [x] get recruiter-owned offers

### Applications
- [x] apply to offer
- [x] get candidate applications
- [x] get candidate application detail
- [x] get recruiter applications
- [x] get recruiter applications by offer
- [x] update application status

### Notifications
- [x] get notifications
- [x] get unread notifications
- [x] mark one as read
- [x] mark all as read

---

## 17. Final Note
The backend is already in a usable MVP state for frontend integration.
The frontend developer can start immediately with authentication, job offer browsing, application flow, recruiter management, and notifications.

