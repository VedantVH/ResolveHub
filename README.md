# 🏆 ResolveHub: Smart Leave & Grievance Management System

An enterprise-grade, role-based workflow application built for seamless management of employee leave requests and grievance resolutions. Designed with a modern **3D WebGL spatial UI**, real-time **Chart.js analytics**, **Spring AOP performance telemetry**, **OpenAPI / Swagger interactive documentation**, and full **Docker containerization**.

---

## 🚀 Key Features

### 👥 Role-Based Portals

#### 🧑‍💼 Employee Portal (User)
- **Interactive 3D Glassmorphism Dashboard**: View real-time counters of pending, approved, and active concerns overlaid on an interactive Three.js 3D particle universe.
- **Leave Application Module**: Fluid calendar forms with celebratory confetti animations and automated reason validation.
- **Complaint Submission Log**: Simple interface to file issues/grievances directly to HR.
- **One-Click CSV Data Export**: Download live leave and complaint records directly to standard `.csv` spreadsheet files.
- **Real-Time Status Tracking**: Dynamic semantic status badges (Emerald, Amber, Rose) providing clear visual feedback.

#### 👩‍💼 HR/Admin Portal (Specialist)
- **HR & Trend Analytics Dashboard**: Interactive Chart.js trend graphs tracking leave request pipelines, approved leaves, and open unresolved grievances.
- **AOP System Telemetry**: Live performance diagnostics dashboard fetching real-time execution times of Java services, visualized with Chart.js bar graphs.
- **Approval Engine**: Single-click processing to Approve/Reject leaves or Resolve complaints.
- **Client-Side Live Filter**: Instant search filter for searching organizational records by name, reason, or date.
- **Auditable Logs**: Aggregated view of all organizational records.

---

## ⚡ Advanced Architectural Integrations

### 🎨 3D WebGL & Semantic Glassmorphism UI
- **Three.js Particle Universe**: Interactive mouse-parallax 3D particle canvas rendering floating wireframe geometries (`Torus` & `Octahedron`).
- **Chart.js Analytics**: Responsive trend line charts and AOP performance latency bar graphs.
- **Framer Motion**: Smooth spring physics page transitions, card hover transformations, and dynamic list layout shifts.
- **Semantic Translucent Palette**: Designed with clear visual intent—Emerald for approvals, Amber for pending reviews, Rose Crimson for urgent concerns, and Electric Violet for actions.

### 📊 Aspect-Oriented Programming (Spring AOP Profiling)
- **Aspect Execution**: The `PerformanceLoggingAspect` class dynamically intercepts method executions inside the service layer and records execution metrics.
- **Visual Analytics**: Metrics are exposed via `/api/admin/metrics` and rendered on the Admin Telemetry dashboard.

### 📜 Interactive OpenAPI / Swagger Documentation
- **Swagger UI**: Integrated OpenAPI spec accessible at `/swagger-ui.html` for interactive REST API testing with JWT Bearer authentication.

### 🔀 Asynchronous Concurrency & Multithreading (`@Async`)
- **Thread Pool Config**: Custom `ThreadPoolTaskExecutor` pool inside `AsyncConfig` (`core: 3`, `max: 10`, `queue: 100`) offloading SMTP email processing to background worker threads.

### 🛡️ Custom Java Constraints & Validation (JSR-380 Spec)
- **DateRange Constraint**: Custom `@ValidDateRange` annotation supported by `DateRangeValidator` class.
- **Global Exception Handler**: Intercepts validation rejections and returns formatted `ErrorResponse` payloads.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | **Java 17 / Spring Boot 3.2.5** | Core framework for performance, security, and DI. |
| **API Docs** | **SpringDoc OpenAPI / Swagger** | Interactive API documentation. |
| **Security** | **Spring Security & JWT** | Stateless role-based authorization (USER/ADMIN). |
| **Database** | **MySQL / H2 / JPA Hibernate** | Flexible ORM supporting H2 in-memory or MySQL 8. |
| **Frontend** | **React.js (Vite) + Three.js** | WebGL 3D particle canvas and reactive UI engine. |
| **Charts** | **Chart.js + React-Chartjs-2** | Interactive trend graphs and telemetry metrics. |
| **Animations** | **Framer Motion + Confetti** | Smooth spring animations and celebratory micro-interactions. |
| **Containerization**| **Docker & Docker Compose** | Multi-stage Docker builds for backend, frontend, and MySQL. |

---

## 📁 Directory Layout

```
ResolveHub/
├── backend/
│   ├── Dockerfile
│   ├── src/main/java/com/smartleave/backend/
│   │   ├── aspect/          # Spring AOP Profiling Aspect
│   │   ├── config/          # DataInitializer, OpenApiConfig, AsyncConfig
│   │   ├── controller/      # REST API Controllers (Auth, Leave, Complaint)
│   │   ├── entity/          # JPA Models (User, LeaveRequest, Complaint)
│   │   ├── security/        # JWT & Web Security Core
│   │   └── service/         # Business Logic
│   └── src/main/resources/
│       └── application.properties # H2/MySQL connection properties
│
├── frontend/
│   ├── Dockerfile
│   ├── src/
│   │   ├── components/      # Dashboard, Background3D, AnalyticsCharts, ExportCSVButton
│   │   ├── context/         # AuthContext & ToastContext
│   │   ├── index.css        # Semantic Translucent Glassmorphism Theme
│   │   └── App.jsx          # Route control
│   └── index.html
│
└── docker-compose.yml       # Multi-container orchestration
```

---

## ⚙️ Running Locally

### Option 1: Zero-Config Standalone Run
1. **Start Backend**:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
   *Runs on `http://localhost:8080` with embedded H2 database and auto-seeded demo accounts.*

2. **Start Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *Launches on `http://localhost:5173`.*

### Option 2: Docker Compose (Full-Stack)
```bash
docker-compose up --build
```
- **Frontend (Nginx):** `http://localhost`
- **Backend API:** `http://localhost:8080`
- **Swagger Docs:** `http://localhost:8080/swagger-ui.html`

---

## 🔑 Demo Login Accounts
Auto-seeded on startup via `DataInitializer`:
- **HR Admin:** `admin@resolvehub.com` / `Admin@123`
- **Employee:** `employee@resolvehub.com` / `Employee@123`
