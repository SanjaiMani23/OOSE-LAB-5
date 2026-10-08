# Online Course Reservation System — Backend

Express + MongoDB REST API for the Online Course Reservation System.

---

## Technology Stack

| Layer      | Technology              |
|------------|-------------------------|
| Runtime    | Node.js                 |
| Framework  | Express.js              |
| Database   | MongoDB + Mongoose      |
| Auth       | bcryptjs                |
| Config     | dotenv                  |
| CORS       | cors                    |
| Dev Server | nodemon                 |

---

## Folder Structure

```
backend/
├── config/         db.js — MongoDB connection
├── controllers/    Business logic (auth, courses, reservations, enrollments)
├── models/         Mongoose models (Student, Course, Reservation, Enrollment)
├── routes/         Express routers
├── middleware/     Centralized error handling
├── seed.js         Database seed script
└── server.js       App entry point
```

---

## Installation

```bash
cd backend
npm install
```

---

## Environment Setup

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

`.env` contents:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/online_course_reservation
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

---

## MongoDB Setup

Make sure MongoDB is running locally:

```bash
# Windows — start MongoDB service
net start MongoDB

# Or start mongod directly
mongod
```

---

## Seed Database

Populate the database with initial students and courses:

```bash
npm run seed
```

Default student credentials after seeding:
- **Email:** student@example.com  
- **Password:** password123

---

## Running the Server

Development (with auto-restart):

```bash
npm run dev
```

Production:

```bash
npm start
```

Server runs at: **http://localhost:5000**

---

## API Endpoints

### Auth
| Method | Endpoint          | Description         |
|--------|-------------------|---------------------|
| POST   | /api/auth/login   | Student/Admin login |

### Courses
| Method | Endpoint           | Description         |
|--------|--------------------|---------------------|
| GET    | /api/courses       | Get all courses     |
| GET    | /api/courses/:id   | Get course by ID    |
| POST   | /api/courses       | Create course       |
| PUT    | /api/courses/:id   | Update course / fee |
| DELETE | /api/courses/:id   | Delete course       |

### Reservations
| Method | Endpoint               | Description             |
|--------|------------------------|-------------------------|
| POST   | /api/reservations      | Create reservation      |
| GET    | /api/reservations      | Get all reservations    |
| GET    | /api/reservations/:id  | Get single reservation  |
| PUT    | /api/reservations/:id  | Update/cancel           |
| DELETE | /api/reservations/:id  | Delete reservation      |

### Enrollments
| Method | Endpoint              | Description            |
|--------|-----------------------|------------------------|
| POST   | /api/enrollments      | Create enrollment      |
| GET    | /api/enrollments      | Get all enrollments    |
| GET    | /api/enrollments/:id  | Get single enrollment  |
| PUT    | /api/enrollments/:id  | Update enrollment      |
| DELETE | /api/enrollments/:id  | Delete enrollment      |

---

## Frontend Connection

The React frontend runs at: `http://localhost:5173`  
The backend API is at: `http://localhost:5000/api`

CORS is pre-configured to allow the frontend origin.
