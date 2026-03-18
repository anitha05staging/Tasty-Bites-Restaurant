import { Sequelize } from 'sequelize';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

let sequelize;

const dbUrl = process.env.DATABASE_URL;

if (dbUrl) {
    const isProduction = process.env.NODE_ENV === 'production' || dbUrl.includes('neon.tech');
    
    sequelize = new Sequelize(dbUrl, {
        dialect: 'postgres',
        dialectModule: pg,
        logging: false,
        dialectOptions: isProduction ? {
            ssl: {
                require: true,
                rejectUnauthorized: false
            },
            connectTimeout: 10000
        } : {},
        pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
    });
} else {
    sequelize = new Sequelize(
        process.env.DB_NAME || 'tasty_bites',
        process.env.DB_USER || 'postgres',
        process.env.DB_PASSWORD || 'postgres123',
        {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            dialect: 'postgres',
            dialectModule: pg,
            logging: false,
            pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
        }
    );
}

// Named exports to match index.js
export const db = sequelize;
export let isDbInitialized = false;

// Monitor initialization
sequelize.authenticate().then(() => {
    isDbInitialized = true;
}).catch(() => {
    isDbInitialized = false;
});

export default sequelize;
