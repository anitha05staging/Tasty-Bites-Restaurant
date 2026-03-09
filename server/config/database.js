import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

let sequelize;

if (process.env.NODE_ENV === 'production') {
    // PostgreSQL for production
    sequelize = new Sequelize(
        process.env.DB_NAME || 'tasty_bites',
        process.env.DB_USER || 'postgres',
        process.env.DB_PASSWORD || '',
        {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            dialect: 'postgres',
            logging: false,
            pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
        }
    );
} else {
    // SQLite for development
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './database.sqlite',
        logging: false
    });
}

export default sequelize;
