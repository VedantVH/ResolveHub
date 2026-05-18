# 🏆 Smart Leave & Complaint Management System

An enterprise-grade, role-based workflow application built for seamless management of employee leave requests and grievance resolutions. Designed to satisfy modern Full Stack Engineer (FSE) industry benchmarks (including Cognizant FSE / GenC Next evaluations), technical assessments, and recruitment examinations at top product and service-oriented organizations, this system transitions manual, spreadsheet-based systems into a high-performance, auditable digital portal.

---

## 🚀 Key Features

### 👥 Role-Based Portals

#### 🧑‍💼 Employee Portal (User)
- **Interactive Dashboard**: View real-time counters of pending, approved, and active concerns.
- **Leave Application Module**: Fluid calendar forms to apply for leaves with automated reason validation.
- **Complaint Submission Log**: Simple interface to file issues/grievances directly to HR.
- **Real-Time Status Tracking**: Instant visual feedback on application states (Pending, Approved, Rejected, Resolved) using dynamic status badges.

#### 👩‍💼 HR/Admin Portal (Specialist)
- **HR Analytics Dashboard**: High-level visual widgets tracking active leave pipelines, approved leaves, and open unresolved grievances.
- **AOP System Telemetry**: Live performance diagnostics dashboard fetching real-time execution times of Java services.
- **Approval Engine**: Single-click processing to Approve/Reject leaves or Resolve complaints.
- **Auditable Logs**: Aggregated view of all organizational records.

---

## ⚡ Advanced Architectural Integrations

### 📊 Aspect-Oriented Programming (Spring AOP Profiling)
To demonstrate advanced system-level engineering, the backend implements Spring AOP to profile and audit service performance.
- **Aspect Execution**: The `PerformanceLoggingAspect` class dynamically intercepts method executions inside the service layer and records execution metrics.
- **Visual Analytics**: Metrics are securely exposed via the REST endpoint `/api/admin/metrics` and visualized inside a dedicated "Spring Boot Runtime Telemetry" card inside the React Admin dashboard.

### 🔀 Asynchronous Concurrency & Multithreading (`@Async`)
To keep backend operations highly responsive, transactional emails are dispatched asynchronously.
- **Thread Pool Config**: Set up a custom `ThreadPoolTaskExecutor` pool inside `AsyncConfig` (`core: 3`, `max: 10`, `queue: 100`).
- **Async Execution**: Annotating `EmailService` with `@Async` offloads SMTP processing to background worker threads, freeing HTTP request threads immediately.

### 🛡️ Custom Java Constraints & Validation (JSR-380 Spec)
Rather than relying solely on client validation, strict custom validation constraints are enforced on the Java model:
- **DateRange Constraint**: Created `@ValidDateRange` custom annotation supported by a custom `DateRangeValidator` class.
- **REST Exception Handler**: A global `@RestControllerAdvice` class (`GlobalExceptionHandler`) intercepts validation rejections and returns formatted, field-specific `ErrorResponse` payloads.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | **Java 17 / Spring Boot 3.2.5** | Core framework for performance, security, and DI. |
| **Security** | **Spring Security & JWT** | Stateless role-based authorization (USER/ADMIN). |
| **Database** | **MySQL / JPA Hibernate** | ORM mapper for robust schema updates and relations. |
| **Notifications** | **Spring Boot Mail** | Asynchronous email generation. |
| **Frontend** | **React.js (Vite)** | Reactive UI engine with fast Hot Module Replacement (HMR). |
| **Icons** | **Lucide React** | Clean, premium SVG vector iconography. |
| **Styling** | **Premium Vanilla CSS** | Curated CSS tokens, backdrop filters, glassmorphic effects. |

---

## 📁 Project Architecture & Directory Layout

```
smart-leave-system/
├── backend/
│   ├── src/main/java/com/smartleave/backend/
│   │   ├── controller/      # REST API Controllers (Auth, Leave, Complaint)
│   │   ├── dto/             # Data Transfer Objects (AuthReq, LeaveReqDTO)
│   │   ├── entity/          # JPA Models (User, LeaveRequest, Complaint)
│   │   ├── repository/      # Spring Data Repositories
│   │   ├── security/        # JWT & Web Security Core
│   │   └── service/         # Business Logic (Email, Leave, Complaint Service)
│   │
│   └── src/main/resources/
│       └── application.properties # Server configs, MySQL, and Mail properties
│
└── frontend/
    ├── src/
    │   ├── components/      # UI components (Navbar, Login, Dashboard, Forms)
    │   ├── context/         # AuthContext state manager & Axios interceptors
    │   ├── App.jsx          # Route control & Protected routes
    │   ├── index.css        # Premium Global Styling & Theme System
    │   └── main.jsx         # DOM binder
    └── index.html           # Main HTML shell
```

---

## ⚙️ Running Locally

### 🗄️ Database Setup
1. Open your MySQL client (Command Line, Workbench, or phpMyAdmin).
2. The backend is configured to automatically create the database if it doesn't exist via the connection properties: `createDatabaseIfNotExist=true`.
3. Set your MySQL username and password in [application.properties](file:///Users/vedanthonnangi/Desktop/Java/smart-leave-system/backend/src/main/resources/application.properties):
   ```properties
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

### ☕ Running the Backend
From the `backend` directory, start the Spring Boot server using the Maven wrapper:
```bash
cd backend
./mvnw spring-boot:run
```
The server will boot and run on `http://localhost:8080`.

### ⚛️ Running the Frontend
From the `frontend` directory, install packages and start the Vite development server:
```bash
cd frontend
npm install
npm run dev
```
The development server will launch on `http://localhost:5173`. Open this URL in your browser to experience the application.

---

## 🎯 Verification & Build Success
The backend has been verified using a clean Maven compiler run:
```bash
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  7.373 s
[INFO] ------------------------------------------------------------------------
```
Both backend services and frontend interfaces are fully written, styled, and resolved without conflicts!
