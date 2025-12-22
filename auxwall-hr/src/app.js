import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';
import { initializeHRModule } from './index.js';

const app = express();
app.use(express.json());

// 1. Initialize PostgreSQL Database
const sequelize = new Sequelize('companydb', 'postgres', 'admin', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false, // Set to console.log to debug SQL queries
    dialectOptions: {
        // Required for some cloud providers like Heroku/Render
        // ssl: { rejectUnauthorized: false } 
    }
});

/**
 * HOST MODELS (PostgreSQL names are usually case-sensitive if quoted)
 */
const Company = sequelize.define('company', {
    companyId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { tableName: 'companies', timestamps: false });

const Staff = sequelize.define('staff', {
    staffId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    }
}, { tableName: 'staffs', timestamps: false });

const startHRModule = async () => {
    try {
        await Company.sync({ alter: true });
        await Staff.sync({ alter: true });

        console.log("✅ Host tables (Company & Staff) synced.");

        await initializeHRModule({
            app,
            sequelize,
            models: { Company, Staff },
            uploadPath: path.resolve('./uploads/hr_documents'),
            path: '/api/hr',
            autoSync: true // In Postgres, this will create tables in your public schema
        });

        app.listen(3000, () => {
            console.log('🚀 HR Module running on Postgres at http://localhost:3000/api/hr');
        });
    } catch (error) {
        console.error('❌ Postgres Connection Error:', error);
    }
};

startHRModule();