# 📚 IskolaRoom: Classroom Booking Management System

## Overview

**IskolaRoom** is a full-stack web application designed for managing room reservations across multiple facilities and departments in an educational institution. It incorporates role-based access control, enabling different levels of access for administrators and regular users (students or faculty), and streamlining the process of room booking, approval, and scheduling.

## Specifications

### ✅ Functional Requirements

1. **User Management**
   - Admins can create, view, and manage user accounts.
   - Users (students or faculty) are invited by admins and set their passwords via email verification.

2. **Role-Based Access Control**
   - Two roles: Admin and User.
   - Admins have full access to manage facilities, rooms, departments, and booking approvals.
   - Users can create and manage their own bookings only.

3. **Facility and Room Management**
   - Admins can perform CRUD operations on facilities (buildings).
   - Facilities can have multiple rooms with attributes like capacity and equipment.

4. **Department Management**
   - Admins define academic departments; each user belongs to one.
   - Bookings can be filtered or reported by department.

5. **Booking Workflow**
   - `Draft`: Booking in progress, not yet submitted.
   - `Pending`: Submitted for admin approval.
   - `Approved`: Confirmed booking.
   - `Rejected`: Declined by the admin.
   - `Cancelled`: Users can cancel pending/approved bookings before the event date.

6. **Availability Checking**
   - Server-side logic prevents overlapping active bookings for the same room and time slot.

7. **Notifications**
   - Email alerts for account setup, password reset, and booking status updates.

## Business Rules

1. **User Invitation**
   - Only admins can register new users; self-registration is not allowed.

2. **Role Enforcement**
   - Only admins can manage facilities, departments, and booking approvals.
   - Users are restricted to viewing and managing their own bookings.

3. **Booking Status Transitions**
   - Bookings begin as `Draft`.
   - Submitted drafts become `Pending`.
   - Admins can approve or reject.
   - Users may cancel `Pending` or `Approved` bookings (before the event date).

4. **Room Availability**
   - No overlapping `Approved` bookings allowed for the same room and timeslot.

5. **Deletion Rules**
   - Only `Draft` bookings may be deleted by users.
   - Other statuses cannot be deleted.

6. **Time Constraints**
   - Bookings must be scheduled within operational hours (e.g., 08:00–20:00).


## ✨ Features

### Authentication & Authorization
- Firebase-powered login system
- Admin-driven user registration
- Password reset via email

### Facility & Room Modules
- CRUD operations on facilities and rooms
- Room details include capacity 

### Department Module
- Create and manage academic departments

### User Module
- Admin dashboard for managing users and assigning roles

### Booking Module
- Calendar view using React Big Calendar
- Filter bookings by facility, room, date, and time
- In-line booking form with status tracking and draft editing

### Admin Booking Management
- List of `Pending` bookings for approval/rejection
- Email alerts sent on booking status updates

### ⚠Validation & Error Handling
- Server-side validation of all booking data
- Friendly, clear error messages on UI


## Tech Stack

| Layer         | Technology                           |
|---------------|--------------------------------------|
| **Frontend**  | React, Vite, Tailwind CSS, React Big Calendar, React Router |
| **Backend**   | Node.js, Express                     |
| **Database**  | MySQL (via Sequelize ORM)            |
| **Auth** | Firebase Authentication |


## Setup Instructions

1. **Clone the repository.**
2. **Navigate to the `/client` and `/server` directories and install dependencies:**
   ```bash
   npm install
3. **Set up your environment variables:**
   - Firebase Config
   - MYSQL Credentials
4. **Run the development server:**
    ```bash
   npm run dev
