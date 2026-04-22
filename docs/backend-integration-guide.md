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
- Candidate profile management
- Recruiter profile management
- Candidate dashboard summary
- Recruiter dashboard summary
- Job offer management
- Job application management
- Notifications
- Pagination and partial filtering

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

### Token behavior
- Valid token -> request proceeds normally
- Expired token -> `401` with `{"status": 401, "error": "Token expired"}`
- Invalid token -> `401` with `{"status": 401, "error": "Invalid token"}`

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

## 7.3 Candidate Profile

### Get current candidate profile
**GET** `/api/candidate/profile`

Auth required: candidate only

Response:
```json
{
  "userId": 1,
  "firstName": "Massine",
  "lastName": "Amakhtari",
  "email": "massine@example.com",
  "phone": "0612345678",
  "address": "Casablanca, Morocco",
  "headline": "Java Backend Developer",
  "summary": "Backend-focused software engineering student with Spring Boot and PostgreSQL experience.",
  "cvUrl": "https://example.com/cv/massine.pdf"
}
```

### Update current candidate profile
**PUT** `/api/candidate/profile`

Auth required: candidate only

Request body:
```json
{
  "phone": "0612345678",
  "address": "Casablanca, Morocco",
  "headline": "Java Backend Developer",
  "summary": "Backend-focused software engineering student with Spring Boot and PostgreSQL experience.",
  "cvUrl": "https://example.com/cv/massine.pdf"
}
```

---

## 7.4 Recruiter Profile

### Get current recruiter profile
**GET** `/api/recruiter/profile`

Auth required: recruiter only

Response:
```json
{
  "userId": 2,
  "firstName": "Amine",
  "lastName": "Moussaid",
  "email": "amine@example.com",
  "companyName": "TechCorp",
  "companyWebsite": "https://techcorp.example.com",
  "companySector": "Software Engineering",
  "companyDescription": "TechCorp is building modern enterprise software solutions."
}
```

### Update current recruiter profile
**PUT** `/api/recruiter/profile`

Auth required: recruiter only

Request body:
```json
{
  "companyName": "TechCorp",
  "companyWebsite": "https://techcorp.example.com",
  "companySector": "Software Engineering",
  "companyDescription": "TechCorp is building modern enterprise software solutions."
}
```

---

## 7.5 Candidate Dashboard

### Get candidate dashboard summary
**GET** `/api/candidate/profile/dashboard`

Auth required: candidate only

Response shape:
```json
{
  "totalApplications": 2,
  "pendingApplications": 0,
  "inReviewApplications": 0,
  "acceptedApplications": 2,
  "rejectedApplications": 0
}
```

---

## 7.6 Recruiter Dashboard

### Get recruiter dashboard summary
**GET** `/api/recruiter/profile/dashboard`

Auth required: recruiter only

Response shape:
```json
{
  "totalJobOffers": 2,
  "activeJobOffers": 2,
  "inactiveJobOffers": 0,
  "totalApplicationsReceived": 2,
  "pendingApplications": 0,
  "inReviewApplications": 0,
  "acceptedApplications": 2,
  "rejectedApplications": 0
}
```

---

## 7.7 Job Offers

### Get all active job offers
**GET** `/api/job-offers`

Public endpoint.

Supports pagination:
```text
GET /api/job-offers?page=0&size=5
```

Paginated response shape:
```json
{
  "content": [
    {
      "id": 2,
      "title": "Java Backend Developer",
      "description": "We are looking for a backend developer with Spring Boot experience.",
      "contractType": "CDI",
      "location": "Casablanca",
      "salary": 12000.00,
      "active": true,
      "createdAt": "2026-04-17T20:32:16.465376",
      "recruiterId": 2,
      "recruiterEmail": "amine@example.com"
    }
  ],
  "totalElements": 2,
  "totalPages": 1,
  "size": 5,
  "number": 0
}
```

### Get job offer by id
**GET** `/api/job-offers/{id}`

Public endpoint.

### Get recruiter's own job offers
**GET** `/api/job-offers/me`

Auth required: recruiter only

Supports pagination:
```text
GET /api/job-offers/me?page=0&size=5
```

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

## 7.8 Applications

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

Supports pagination:
```text
GET /api/applications/me?page=0&size=5
```

### Get one of my applications by id
**GET** `/api/applications/me/{applicationId}`

Auth required: candidate only
Can only access own applications.

### Get all applications across recruiter's offers
**GET** `/api/applications/recruiter`

Auth required: recruiter only

Supports pagination:
```text
GET /api/applications/recruiter?page=0&size=5
```

Supports optional filtering by status:
```text
GET /api/applications/recruiter?status=ACCEPTED&page=0&size=5
```

Allowed status filters:
- `PENDING`
- `IN_REVIEW`
- `ACCEPTED`
- `REJECTED`

### Get applications for a specific recruiter-owned job offer
**GET** `/api/applications/recruiter/job-offers/{jobOfferId}`

Auth required: recruiter only
Can only access applications for job offers owned by the authenticated recruiter.

Supports pagination:
```text
GET /api/applications/recruiter/job-offers/{jobOfferId}?page=0&size=5
```

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

## 7.9 Notifications

Notifications are stored in the database and exposed through REST endpoints.

### Notification triggers currently implemented
- Candidate applies to a job offer -> recruiter receives `NEW_APPLICATION`
- Recruiter updates application status -> candidate receives `APPLICATION_STATUS_UPDATED`

### Get all my notifications
**GET** `/api/notifications`

Auth required: yes

Supports pagination:
```text
GET /api/notifications?page=0&size=5
```

### Get unread notifications
**GET** `/api/notifications/unread`

Auth required: yes

Supports pagination:
```text
GET /api/notifications/unread?page=0&size=5
```

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
- `GET /api/candidate/profile`
- `PUT /api/candidate/profile`
- `GET /api/candidate/profile/dashboard`
- `POST /api/applications/job-offers/{jobOfferId}`
- `GET /api/applications/me`
- `GET /api/applications/me/{applicationId}`

## Recruiter-only routes
- `GET /api/recruiter/profile`
- `PUT /api/recruiter/profile`
- `GET /api/recruiter/profile/dashboard`
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
- expired token returns `401`
- invalid token returns `401`

### Job offers
- only recruiters can create, update, delete offers
- only the owner recruiter can modify or delete a given offer
- public listing returns only active job offers

### Applications
- only candidates can apply
- candidate cannot apply twice to the same offer
- candidate can only access their own applications
- recruiter can only access applications related to their own offers
- recruiter applications endpoint supports optional status filtering

### Notifications
- users can only read and update their own notifications

### Profiles
- users can only read and update their own profile

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

### Expired token
```json
{
  "status": 401,
  "error": "Token expired"
}
```

### Invalid token
```json
{
  "status": 401,
  "error": "Invalid token"
}
```

Note: some unauthenticated protected requests may still return `403` depending on the endpoint and current security flow, but expired and malformed JWTs now return `401` explicitly.

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
4. call `/api/candidate/profile`
5. call `/api/candidate/profile/dashboard`
6. show candidate dashboard
7. browse job offers
8. apply to an offer
9. view own applications
10. view notifications

## Recruiter app flow
1. register or login
2. store JWT
3. call `/api/users/me`
4. call `/api/recruiter/profile`
5. call `/api/recruiter/profile/dashboard`
6. show recruiter dashboard
7. create/manage job offers
8. view applications across offers
9. view applications for one specific offer
10. update application statuses
11. view notifications

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
- centralize 401 and 403 handling
- redirect to login when token is missing, expired, or invalid

### Session bootstrap
On app load:
1. read token from storage
2. if token exists, call `/api/users/me`
3. if success, restore session
4. if failure, clear token and redirect to login

### Pagination
The frontend should now expect Spring Data `Page` responses on these endpoints:
- `/api/job-offers`
- `/api/job-offers/me`
- `/api/applications/me`
- `/api/applications/recruiter`
- `/api/applications/recruiter/job-offers/{jobOfferId}`
- `/api/notifications`
- `/api/notifications/unread`

Important `Page` fields typically used by the frontend:
- `content`
- `totalElements`
- `totalPages`
- `size`
- `number`
- `first`
- `last`
- `empty`

---

## 13. Known Gaps / Next Backend Improvements
These are not blockers for current frontend work, but they are not yet implemented:

- admin business endpoints
- job offer search and filtering by keyword/location/contract type
- CV file upload
- refresh token flow
- custom centralized auth entry point for fully consistent unauthorized behavior
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

- OpenAPI documentation
- seed/demo data strategy for frontend development
- job offer search and filtering
- profile validation improvements
- file upload for CVs

---

## 16. Quick Endpoint Checklist

### Auth
- [x] register candidate
- [x] register recruiter
- [x] login
- [x] current user

### Profiles
- [x] get candidate profile
- [x] update candidate profile
- [x] get recruiter profile
- [x] update recruiter profile

### Dashboards
- [x] candidate dashboard summary
- [x] recruiter dashboard summary

### Job Offers
- [x] list public offers
- [x] get public offer detail
- [x] create offer
- [x] update offer
- [x] delete offer
- [x] get recruiter-owned offers
- [x] paginate public offers
- [x] paginate recruiter-owned offers

### Applications
- [x] apply to offer
- [x] get candidate applications
- [x] get candidate application detail
- [x] get recruiter applications
- [x] get recruiter applications by offer
- [x] update application status
- [x] paginate candidate applications
- [x] paginate recruiter applications
- [x] paginate recruiter applications by offer
- [x] filter recruiter applications by status

### Notifications
- [x] get notifications
- [x] get unread notifications
- [x] mark one as read
- [x] mark all as read
- [x] paginate notifications
- [x] paginate unread notifications

---

## 17. Final Note
The backend is already in a usable MVP-plus state for frontend integration.
The frontend developer can start immediately with authentication, profile pages, dashboards, job offer browsing, application flow, recruiter management, notifications, and paginated list screens.
