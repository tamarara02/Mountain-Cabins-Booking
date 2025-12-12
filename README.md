# Mountain Cabins Booking Web Application

## Overview
This is a full-stack web application for booking mountain cabins. The frontend is built with Angular, and the backend uses Spring Boot. The application connects to a SQL database to manage cabins, users, and bookings.

## Getting Started

### 1. Clone the project
git clone <repository-url>

### 2. Frontend Setup
1. Navigate to the frontend folder:
cd frontend
2. Install dependencies:
npm install
3. Start the development server:
npm start
- The app will run at http://localhost:4200.

### 3. Backend & Database Setup
1. Import the SQL database into your SQL Workbench.
2. If your database password is different, update the credentials in:
backend/backend_SpringBoot/src/main/resources/application.properties

## Sample Users

| Role    | Username | Password   |
|---------|----------|-----------|
| Owner   | tamarar  | Tamara123 |
| Tourist | miljan   | Mili123   |
| Admin   | anas     | Anas123   |

You can use these accounts for testing the application.

## Notes
- Make sure Node.js and Angular CLI are installed for frontend.
- Ensure Java and Spring Boot are properly set up for the backend.
- `npm install` must be run in the frontend folder before starting the app.
