# EventBook — Event Booking Management System

A full-stack web application for managing events, categories, and bookings. Built with ASP.NET Core Web API and React.

![Dashboard](https://img.shields.io/badge/Status-Complete-brightgreen) ![.NET](https://img.shields.io/badge/.NET-10-512BD4) ![React](https://img.shields.io/badge/React-19-61DAFB) ![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4)

---

## Features

- **Dashboard** — Real-time stats, interactive charts, upcoming events timeline, and recent bookings
- **Event Management** — Full CRUD with category filtering, search, capacity tracking, and undo delete
- **Category Management** — Organise events into categories with icon-based UI
- **Booking Management** — Track participant registrations with status management and duplicate prevention
- **Capacity Enforcement** — Automatically prevents overbooking and duplicate bookings
- **Toast Notifications** — Real-time feedback for all user actions
- **Skeleton Loading** — Smooth loading states across all pages
- **Weighted Search** — Relevance-scored search across all entities

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | ASP.NET Core Web API (.NET 10) |
| ORM | Entity Framework Core |
| Database | Microsoft SQL Server |
| Frontend | React 19 (Vite) |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Routing | React Router DOM v6 |
| HTTP Client | Axios |

---

## Architecture

The backend follows a three-layer architecture:

```
Controller → Service → Repository → Database
```

- **Controllers** — Handle HTTP requests and responses
- **Services** — Business logic and validation
- **Repositories** — Data access via Entity Framework Core
- **DTOs** — Separate request/response models from domain models

---

## Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (or SQL Server Express)

### Backend Setup

```bash
cd EventBooking.API

# Restore packages
dotnet restore

# Update appsettings.json with your SQL Server connection string
# "DefaultConnection": "Server=localhost;Database=EventBookingDB;Trusted_Connection=True;TrustServerCertificate=True;"

# Run the application (auto-creates database and seeds data)
dotnet run
```

The API will be available at `http://localhost:5281`. Swagger UI is accessible at `http://localhost:5281/swagger`.

> The application uses `DbSeeder` to automatically create the database schema and populate seed data on first run.

### Frontend Setup

```bash
cd eventbooking-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/Category | Get all categories |
| POST | /api/Category | Create category |
| PUT | /api/Category/{id} | Update category |
| DELETE | /api/Category/{id} | Delete category |
| GET | /api/Event | Get all events |
| POST | /api/Event | Create event |
| PUT | /api/Event/{id} | Update event |
| DELETE | /api/Event/{id} | Delete event |
| GET | /api/Booking | Get all bookings |
| POST | /api/Booking | Create booking |
| PUT | /api/Booking/{id} | Update booking |
| DELETE | /api/Booking/{id} | Delete booking |

---

## Project Structure

```
EventBooking/
├── EventBooking.API/
│   ├── Controllers/        # API controllers
│   ├── Services/           # Business logic
│   ├── Repositories/       # Data access
│   ├── Models/             # Domain models
│   ├── DTOs/               # Data transfer objects
│   ├── Data/               # DbContext and DbSeeder
│   └── appsettings.json    # Configuration
├── eventbooking-frontend/
│   ├── src/
│   │   ├── components/     # Navbar, Toast, Skeleton
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── events/
│   │   │   ├── categories/
│   │   │   └── bookings/
│   │   └── api.js          # Axios instance
│   └── package.json
└── database.sql            # Schema and seed data
```

---

## License

This project was developed as an academic assignment for SWE310 Programming Elective II (.NET) at Xiamen University Malaysia.
