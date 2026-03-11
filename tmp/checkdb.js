import { Sequelize } from 'sequelize';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'tasty_bites',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres123',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        dialectModule: pg,
        logging: console.log
    }
);

async function check() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connection has been established successfully.');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

check();
