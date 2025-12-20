# Auxwall HR Module

A lightweight, modular HR management system for the Auxwall ecosystem. This package handles employee documents, activity tracking, and categorization using **Express**, **Sequelize**, and **PostgreSQL**.



## 🚀 Installation

```bash
npm install auxwall-hr-module
```

## 🛠 Integration

To integrate this into your main "Old Project," follow these steps:

### 1. Connect the Database
This module is designed to share your existing database connection. This prevents multiple connection pools and keeps data consistent.

```javascript
import { useSharedDatabase, syncHRModels } from 'auxwall-hr';
import { yourSequelizeInstance } from './path-to-your-db.js';

// 1. Pass your existing connection to the module
useSharedDatabase(yourSequelizeInstance);

// 2. Sync HR-specific tables (does not touch legacy tables)
await syncHRModels({ alter: true });
```

### 2. Register Routes
Mount the HR routes into your main Express application.

```javascript
import express from 'express';
import { hrRouter } from 'auxwall-hr';

const app = express();

// Use the HR routes (e.g., /api/hr/documents)
app.use('/api/hr', hrRouter);
```

---

## 📦 What's Inside?

### Available Models
If you need to perform custom queries, you can import models directly:
* **Staff**
* **Company**
* **Categories**
* **Document**
* **Activities**

### Key Functions
| Function | Purpose |
| :--- | :--- |
| `useSharedDatabase(db)` | Overwrites the module's internal DB connection with your project's connection. |
| `syncHRModels()` | Runs .sync() only on Categories, Documents, and Activities tables. |
| `hrRouter` | The main router containing all HR API endpoints. |

---

## 📁 Required Folder Structure
Your main project must have an `uploads/` folder in the root directory to handle document storage:

```plaintext
main-project/
├── uploads/  <-- Required for document storage
├── app.js
└── package.json
``` 