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
