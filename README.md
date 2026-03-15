# Student Profile Management System

A **React + Vite web application** that allows teachers to manage classes and student profiles. The system supports class management, student records, grade tracking, notes, and skill visualization using a hexagon radar chart.

All data is stored locally in the browser using **localStorage**, so no backend server is required.

---

# Features

## Authentication

- Simple teacher login system
- Credentials stored in localStorage
- Protected routes to prevent unauthorized access

## Class Management

- Create new classes
- Edit class information
- Delete classes
- View students in each class

## Student Management

- Add students to a class
- Edit student information
- Delete students
- Upload and display student profile images
- Drag-and-drop to reorder students

## Student Profile Page

Each student has a dedicated page displaying:

- Student name
- Student ID
- Profile image
- Skill hexagon chart
- Grades
- Notes

## Grade Management

- Add grades
- Edit grades
- Delete grades

Fields include:

- Subject
- Date
- Type (Quiz / Test / Exam)
- Score

## Notes System

- Add notes
- Edit notes
- Delete notes

Used for teacher observations or feedback.

## Skill Visualization

Student performance is visualized using a **hexagon radar chart** with the following skills:

- Communication
- Teamwork
- Problem Solving
- Leadership
- Creativity
- Discipline

---

# Technologies Used

- React
- Vite
- Tailwind CSS
- React Router
- Recharts (Radar Chart)
- @hello-pangea/dnd (Drag and Drop)
- Lucide React Icons
- Browser localStorage

---

# Project Structure
src
│
├── components
│ ├── ClassCard.jsx
│ ├── StudentCard.jsx
│ ├── Navbar.jsx
│ ├── ProtectedRoute.jsx
│ ├── SkillRadarChart.jsx
│ ├── StudentFormModal.jsx
│ ├── GradeFormModal.jsx
│ └── NoteFormModal.jsx
│
├── pages
│ ├── LoginPage.jsx
│ ├── DashboardPage.jsx
│ ├── ClassPage.jsx
│ └── StudentDetailPage.jsx
│
├── context
│ ├── AuthContext.jsx
│ └── SchoolContext.jsx
│
├── utils
│ └── storage.js
│
├── App.jsx
├── main.jsx
└── index.css

---

# How Data is Stored

All data is stored in **browser localStorage**.

Keys used:


student_profile_users
student_profile_classes
student_profile_current_user


Example student structure:

```json
{
  "id": "student1",
  "name": "Alice",
  "studentId": "S1001",
  "image": "base64image",
  "skills": {
    "communication": 80,
    "teamwork": 75,
    "problemSolving": 85,
    "leadership": 70,
    "creativity": 78,
    "discipline": 90
  },
  "grades": [],
  "notes": []
}
```

Installation

Clone the repository

git clone https://github.com/YOUR_USERNAME/student-profile-system.git

Enter the project folder

cd student-profile-system

Install dependencies

npm install

Run development server

npm run dev

Open in browser

http://localhost:5173
Default Login
Username: teacher
Password: 123456
Screenshots

Example images you may add:

/screenshots/login.png
/screenshots/dashboard.png
/screenshots/class-page.png
/screenshots/student-profile.png

Display images in README:

![Dashboard](screenshots/dashboard.png)
Limitations

Because this project uses localStorage:

Data only exists on the current browser

Clearing browser storage removes all data

Passwords are not encrypted

Not suitable for production environments

This design is intended for learning and demonstration purposes.

Future Improvements

Possible enhancements:

Backend API (Node.js + Express)

Database integration (MongoDB / PostgreSQL)

Secure authentication with hashed passwords

Multiple teacher accounts

Student search and filtering

Export/import class data

Dark mode support

Image compression

License

This project is for educational purposes.


---

If you want, I can also make a **much more professional GitHub README** with:

- badges (React, Vite, Tailwind)
- system architecture diagram
- UI screenshots section
- animated demo GIF
- table of contents
- clean section navigation

It will look **like a real production repository**.
