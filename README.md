# School Management System (EduMS)

This repository contains a full-stack school management frontend built with React and Vite. It is a single‑page application designed to support multiple user roles (students, teachers, principals, and administrators) and provides a comprehensive set of tools for managing day‑to‑day academic operations.  
All logic is implemented client‑side using React state and local storage to keep things simple; a backend API could be added later.

---

## 📁 Project Structure

```
src/
  components/        # reusable UI components (sidebar, cards, etc.)
  contexts/          # authentication context/provider
  layout/            # dashboard layout wrapper
  middleware/        # route protection
  routes/            # react-router configuration
  screens/           # top‑level pages grouped by role
    auth/            # login screen
    student/         # student dashboard
    teacher/         # teacher dashboard
    principal/       # principal dashboard
    admin/           # administration interface (new features)
```

Tailwind CSS is used for styling and simple stateful mock data simulates application behaviour.

---

## 🚀 Getting Started

```bash
# install dependencies
npm install

# start development server
npm run dev
```

Visit `http://localhost:5173` in your browser. Changes are hot‑reloaded by Vite.

To create a production build:

```bash
npm run build
```

---

## 🧑‍💻 User Roles & Features

### Student
- View personal dashboard with GPA, attendance, rankings
- Browse enrolled courses and grades
- Track assignments and upcoming exams

### Teacher
- Access dashboard showing classes, assignments, grades
- Grade students and review analytics

### Principal
- See school statistics: staff, students, classes, analytics
- Manage staff and student lists
- View and edit settings

### Administrator (new)
This role unlocks powerful management interfaces:

#### Timetable Management
- Drag‑and‑drop timetable builder
- Assign subjects & teachers to slots
- Supports multiple classes and days

#### Exam DateSheet
- Create exam periods and class schedules
- Set dates, times, rooms per subject
- Edit or delete schedules

#### Student Management
- Add/edit/delete student records
- Search and filter by name/email/class

#### Teacher Management
- Create teacher profiles
- Assign subjects and classes
- Manage qualifications and contact info

#### Fee Tracking
- Track tuition, uniform, and book fees per student
- See visual progress and status (paid/partial/overdue)
- Export records to CSV

#### Profile Management
- Edit admin profile (name, email, bio, photo)
- View/edit all system users (students/teachers)

---

## 💬 Authentication
A simple form allows picking a role and entering an email/password. Credentials are mocked; any non‑empty values work. User data is stored in `localStorage`.

## 🔒 Route Protection
`ProtectedRoute` component wraps dashboard sections, redirecting unauthenticated users to login.

## 💡 Technology Stack
- React 18 + Hooks
- Vite (fast dev server)
- React Router v6
- Tailwind CSS for utility styling
- Lucide icons

## 🛠 Extending the App
The current implementation uses in‑memory/local state. For a real application:
1. Replace mock logic in `AuthContext` with API calls.
2. Persist timetables, exams, users in a backend database.
3. Add role‑based permissions on the server.
4. Integrate email notifications or payment gateways.

---

## ✅ Summary for Recruiters
This project demonstrates:
- Multi‑role SPA with dynamic routing
- Complex administrative UX (drag‑drop, editable tables, forms)
- Clean React architecture using contexts, components, and hooks
- Responsiveness and accessibility basics
- Write‑once‑use‑everywhere UI design with Tailwind

It’s a polished frontend prototype ready to be connected to any REST/GraphQL backend.

---

Feel free to explore the `src/screens/admin` directory for detailed implementations of each module.

Happy coding! 🎓
