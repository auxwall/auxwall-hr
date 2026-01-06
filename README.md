
# Auxwall HR Module

A **plug-and-play HR management module** for **Express + Sequelize** applications.

This module provides:
- 📁 HR Document Management  
- 🧑‍💼 Staff & Company Integration  
- ⏱ Attendance Punching & Shift Management  
- 📊 Attendance Summary & Monthly Reports  
- 🧾 Activity Logging & HR Dashboard Analytics  

It **injects itself into your existing project** without forcing schema changes or duplicating core tables.

---

## 🚀 Features

- Modular & decoupled HR system
- Uses **existing Staff / Company tables**
- Dual-staff document relationship support
- Shift-aware attendance calculations
- Cron-based absence handling
- Monthly attendance reports (payroll-ready)
- Optimized queries for dashboards
- Safe for monolith & modular architectures

---

## 📦 Installation

```bash
npm install auxwall-hr-module
```

---

## 🔌 Attaching `auxwall-hr-module` to Your Current Project

You **must reuse your existing project tables** (users, employees, companies, etc.).

### 1️⃣ Import the Module

```js
const { initializeHRModule } = require("auxwall-hr-module");
```

### 2️⃣ Initialize the HR Module

```js
(async () => {
  await initializeHRModule({
    app,
    sequelize,
    userModels: {
      Staff: YourStaffModel,
      Company: YourCompanyModel,
      Punching: YourAttendanceModel,
      Client: YourClientModel
    },
    uploadPath: "./uploads/hr",
    path: "/api",
    autoSync: true
  });
})();
```

---

## 📊 Attendance Data Flow

```
Punch In / Punch Out
        ↓
updateAttendanceSummary
        ↓
Daily Attendance Summary
        ↓
syncAttendence (Absent marking)
        ↓
Monthly Report / Dashboard
```

---

## 📜 Requirements

- Node.js >= 16
- Express v4
- Sequelize v6
- PostgreSQL / MySQL

---

## 🚀 Summary

Auxwall HR Module provides a complete HR system with attendance, documents, and reporting — fully pluggable into existing projects.
