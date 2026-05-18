# 🏆 Smart Leave & Complaint Management System

An enterprise-grade, role-based workflow application built for seamless management of employee leave requests and grievance resolutions. Designed to satisfy Cognizant FSE hiring expectations, this system transitions manual, Excel-based management into a high-performance digital portal with real-time feedback loops.

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
- **Approval Engine**: Single-click processing to Approve/Reject leaves or Resolve complaints.
- **Auditable Logs**: Aggregated view of all organizational records.

---

## 📧 Advanced Standout Feature: Automated Email Notification
To deliver maximum interview and shortlist value, the backend contains an **Email Notification micro-service**.
- **Leave Approved/Rejected Alert**: Automatically triggers customized notifications to employees when an HR manager updates their application.
- **Complaint Resolution Alert**: Immediately notifies employees with details once their grievance has been resolved.

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
