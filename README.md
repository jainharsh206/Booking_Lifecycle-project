# Booking Lifecycle Management System

##  Overview
This project implements a **Booking Lifecycle Management System** that handles the complete journey of a booking — from creation to completion — with proper state transitions, failure handling, and admin intervention.

It is designed to demonstrate backend logic, state management, and simple UI workflows.

---

##  Features

### 1. Booking Creation
- Create a new booking with basic details
- Initial status: **Pending**

### 2. Provider Assignment
- Automatic or manual provider assignment
- Provider can **accept** or **reject** the booking

### 3. Booking Lifecycle States
The booking moves through the following states:


### 4. Partner / Provider Workflow
- View assigned bookings
- Accept or reject bookings
- Update booking progress

### 5. Failure Handling
- Customer or provider cancellation
- Provider rejection or no-show
- Retry logic for failed operations

### 6. Manual Admin Intervention
- Admin/Ops panel to override booking states
- Resolve stuck or failed bookings

### 7. Observability
- Booking history tracking
- State transition logs
- Event-based visibility

---

##  UI Screens
- Create Booking Screen
- View / Update Booking Status
- Admin / Ops Panel

---

##  Tech Stack
- Frontend: (React / HTML / CSS / JS)  
- Backend: (Node.js / Python / REST APIs)  
- Database: (MongoDB / SQL)  
- Version Control: Git & GitHub

> *(Update tech stack as per your implementation)*

---

##  How to Run the Project

```bash
# Clone repository
git clone https://github.com/jainharsh206/Booking_Lifecycle-project.git

# Navigate into project
cd Booking_Lifecycle-project

# Install dependencies
npm install   # or pip install -r requirements.txt

# Start project
npm start     # or python app.py
