# HR Document Management Module

A comprehensive, modular sub-system for **Sequelize + Express** applications.  
This module handles **document storage**, **hierarchical categorization**, and **activity logging** by injecting itself into a host application.

---

## 🚀 Quick Start (Integration)

To use this module, call the `initializeHRModule` function in your main `app.js` or server startup file.  
This will automatically set up **models**, **associations**, and **API routes**.

```js
import { initializeHRModule } from 'auxwall-hr-module';
import path from 'path';

// Inside your server startup logic
await initializeHRModule({
    app,            // Your Express instance
    sequelize,      // Your Sequelize connection
    models: { 
        Company,    // Host Company model
        Staff       // Host Staff model
    },
    uploadPath: path.resolve('./uploads/hr_documents'),
    path: '/api/hr', // Base prefix for all module routes
    autoSync: true   // Set to true to automatically create/sync tables
});
```

---

## 🏗 Schema Architecture

The module extends your database with **three core tables**.  
It establishes a **Dual-Staff Relationship** to differentiate between:

- Who a document **belongs to**
- Who **uploaded** the document

### 📦 Core Tables

| Model     | Description                                                     | Primary Key |
|----------|-----------------------------------------------------------------|-------------|
| Document | Stores file metadata, expiry dates, status, and relationships    | `id`        |
| Category | Hierarchical document types (Resume, ID, Visa, etc.)             | `id`        |
| Activity | Audit logs for all document-related actions                      | `id`        |

---

## 🔗 Association Aliases

When querying the `Document` model directly, you **must use these aliases** to avoid ambiguity errors caused by multiple foreign keys pointing to the same table.

| Alias            | Description                                   | Foreign Key            |
|------------------|-----------------------------------------------|------------------------|
| `assignedStaff`  | The person the document belongs to             | `hr_staff_id`          |
| `uploader`       | The person who uploaded the document           | `hr_uploaded_by_id`    |
| `category`       | The linked document category                   | `hr_category_id`       |

---

## 📡 API Endpoints

Once initialized, the following endpoints become available under your configured base path  
(e.g. `/api/hr`).

---

### 📊 Summary & Analytics

#### `GET /api/hr/summary`

Returns:
- Total number of categories
- Document count grouped by category

**Notes:**
- Uses **raw SQL queries**
- Bypasses ORM association overhead
- Prevents `"multiple association"` ambiguity errors

---

### 🔍 Search & Filtering

#### `GET /api/hr/documents`

**Query Parameters**

| Parameter       | Description                               |
|-----------------|-------------------------------------------|
| `categoryName`  | Filter by category name                   |
| `documentName`  | Search by document name                   |
| `expiryStart`   | Filter documents expiring after date      |
| `expiryEnd`     | Filter documents expiring before date     |

**Response Features:**
- Paginated results
- Automatically mapped `staffName`
- Automatically mapped `categoryName`

---

## 🛠 Advanced Configuration

### 📁 uploadPath

- Uses **Multer** internally for file uploads
- Ensure the directory has **write permissions**
- Directory is **auto-created** if it does not exist

---

### 🔄 autoSync

If set to `true`, the module runs:
```js
model.sync()
```

for:
- Documents
- Categories
- Activities

> ⚠️ **WARNING**  
> In a **production environment** with existing migrations,  
> it is strongly recommended to set `autoSync` to `false`.

---

## 📜 Requirements

| Requirement   | Supported Version / Details                |
|---------------|--------------------------------------------|
| Express.js    | v4.x                                       |
| Sequelize     | v6.x                                       |
| Database      | PostgreSQL (recommended) or MySQL          |
| Host Models   | `Staff` model must contain a `name` field  |

---

## ✅ Summary

- Plug-and-play HR document management module
- Clean separation from host application
- Safe dual-staff relationship handling
- Optimized analytics using raw SQL
- Production-ready with controlled auto-sync

---

**Happy Building 🚀**
