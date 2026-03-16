import { User } from './backend/models/index.js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

async function checkUsers() {
    try {
        const users = await User.findAll();
        console.log('--- USERS ---');
        users.forEach(u => {
            console.log(`ID: ${u.id}, Email: ${u.email}, Role: ${u.role}`);
        });
    } catch (err) {
        console.error('Error checking users:', err);
    } finally {
        process.exit();
    }
}

checkUsers();
