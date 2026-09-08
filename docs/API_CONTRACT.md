# EduMS API Contract

Base URL: `http://localhost:5001/api`  
Auth header: `Authorization: Bearer <jwt>`  
Envelope:

```json
{ "success": true, "data": { } }
```

Error:

```json
{ "success": false, "message": "Human readable error" }
```

Demo users (password for all: `demo123`)

| Email | Role |
|---|---|
| `student@school.com` | student |
| `teacher@school.com` | teacher |
| `principal@school.com` | principal |
| `admin@school.com` | admin |

---

## Auth

### `POST /auth/login`
Public.

**Body**
```json
{ "email": "admin@school.com", "password": "demo123" }
```

**Response `data`**
```json
{
  "token": "<jwt>",
  "user": {
    "id": "...",
    "name": "Admin User",
    "email": "admin@school.com",
    "role": "admin",
    "permissions": ["manage_timetable", "manage_exams", "manage_students", "manage_teachers", "manage_fees", "manage_profiles"],
    "avatar": "...",
    "className": "",
    "subjects": [],
    "classes": []
  }
}
```

### `GET /auth/me`
Auth required. Returns `{ user }`.

### `PATCH /auth/me`
Auth required.

**Body (any subset)**
```json
{ "name": "Admin", "phone": "999", "bio": "...", "department": "...", "address": "...", "avatar": "..." }
```

---

## Dashboard

### `GET /dashboard`
Auth required. Payload shape depends on role:

- **admin** → `{ stats, recentActivities, upcomingEvents }`
- **principal** → `{ stats, chartData, recentActivities, alerts }`
- **teacher** → `{ stats, classes, todaySchedule, performance }`
- **student** → `{ stats, courses, upcomingAssignments, timetable, student }`

---

## Users

### `GET /users/meta`
Roles: admin, teacher, principal  
Returns `{ classes: string[], subjects: string[] }`

### `GET /users?role=&q=&className=`
Roles: admin, principal  
Returns `{ users: User[] }`

### `POST /users/students`
Roles: admin + `manage_students`

**Body**
```json
{
  "name": "Rahul Singh",
  "email": "rahul2@school.com",
  "password": "demo123",
  "className": "10A",
  "rollNo": "03",
  "phone": "98765",
  "address": "Delhi",
  "admissionDate": "2024-04-15"
}
```

### `PUT /users/students/:id`
### `DELETE /users/students/:id`

### `POST /users/teachers`
Roles: admin + `manage_teachers`

**Body**
```json
{
  "name": "Ms. Verma",
  "email": "verma@school.com",
  "phone": "90000",
  "subjects": ["Computer Science"],
  "classes": ["10A"],
  "qualifications": "M.Tech",
  "joinDate": "2024-01-01"
}
```

### `PUT /users/teachers/:id`
### `DELETE /users/teachers/:id`

### `PUT /users/:id`
Roles: admin + `manage_profiles`  
Update shared profile fields (`name`, `email`, `phone`, `status`, `role`, `department`).

---

## Knowledge Checks

### `GET /knowledge-checks`
Auth required.

- Teacher → own checks (includes answer keys)
- Student → checks attached to their class (**answer keys stripped**)
- Returns `{ knowledgeChecks, attempts }`

### `GET /knowledge-checks/:id`
Student responses omit `isCorrect`.

### `POST /knowledge-checks`
Roles: teacher, admin

**Body**
```json
{
  "title": "Math Quiz",
  "description": "Basics",
  "attachedClasses": ["10A"],
  "questions": [
    {
      "id": 1,
      "type": "single-select",
      "text": "2+2?",
      "options": [
        { "id": 1, "text": "3", "isCorrect": false },
        { "id": 2, "text": "4", "isCorrect": true }
      ],
      "explanation": "2+2=4"
    }
  ]
}
```

### `PUT /knowledge-checks/:id`
### `PATCH /knowledge-checks/attach`

**Body**
```json
{
  "knowledgeCheckIds": ["64f..."],
  "attachedClasses": ["10A", "10B"]
}
```

### `DELETE /knowledge-checks/:id`

### `POST /knowledge-checks/:id/attempts`
Roles: student  
Scoring happens on the server.

**Body**
```json
{
  "answers": [
    { "questionId": 1, "selectedOptions": [2] }
  ]
}
```

**Response `data`**
```json
{
  "attempt": { "id": "...", "score": 100, "totalQuestions": 1, "status": "completed", "timestamp": "..." },
  "review": [
    {
      "questionId": 1,
      "selectedOptions": [2],
      "isCorrect": true,
      "correctOptions": [2],
      "explanation": "2+2=4"
    }
  ]
}
```

---

## Timetables

### `GET /timetables`
Auth required. Returns `{ classes, subjects, teachers, timetables, selectedClass }`

### `GET /timetables/:className`
Students may only request their own class.

### `PUT /timetables/:className`
Roles: admin + `manage_timetable`

**Body**
```json
{
  "monday": [{ "id": 1, "time": "9:00-10:00", "subject": "Mathematics", "teacher": "Mr. Kumar", "room": "101" }],
  "tuesday": [],
  "wednesday": [],
  "thursday": [],
  "friday": [],
  "saturday": []
}
```

---

## Exams

### `GET /exams`
Returns `{ exams, classes, subjects, rooms }`  
Each exam includes `schedules[]` with `class` / `className`, `subject`, `date`, `time`, `room`.

### `POST /exams`
Roles: admin + `manage_exams`  
Body: `{ examName, startDate?, endDate?, status? }`

### `PUT /exams/:id`
### `POST /exams/:id/schedules`
Body accepts `class` or `className`.
### `DELETE /exams/:id`
### `DELETE /exams/:id/schedules/:scheduleId`

---

## Fees

### `GET /fees`
Roles: admin, principal  
Returns `{ students, classes, stats }`

### `PUT /fees/:id`
Roles: admin + `manage_fees`

**Body**
```json
{
  "tuitionPaid": 50000,
  "uniformsPaid": 0,
  "booksPaid": 3000,
  "tuitionFee": 50000,
  "uniforms": 5000,
  "books": 3000
}
```

Server recalculates `totalPaid`, `totalDue`, and `status`.

---

## Notifications

### `GET /notifications`
Auth required. Returns current user’s notifications.

### `PATCH /notifications/:id/read`
### `PATCH /notifications/read-all`

---

## Health

### `GET /health`
Public. `{ status: "ok", service: "EduMS API", time }`

---

## Status codes

| Code | Meaning |
|---|---|
| 200/201 | Success |
| 400 | Validation / bad request |
| 401 | Missing/invalid token |
| 403 | Authenticated but forbidden (role/permission) |
| 404 | Not found |
| 409 | Duplicate key (e.g. email) |
