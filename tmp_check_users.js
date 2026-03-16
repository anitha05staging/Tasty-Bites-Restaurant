import { sequelize, User } from './backend/models/index.js';
import bcrypt from 'bcryptjs';

async function checkUsers() {
    try {
        await sequelize.authenticate();
        console.log('Connected to database.');
        
        const users = await User.findAll();
        console.log(`Found ${users.length} users:`);
        
        users.forEach(u => {
            console.log(`- Email: ${u.email}, Role: ${u.role}, Password Hash: ${u.password.substring(0, 10)}...`);
        });

        // Test a specific login if needed
        const testEmail = 'admin@tastybites.com';
        const testPass = 'admin123';
        const user = await User.findOne({ where: { email: testEmail } });
        if (user) {
            const match = await bcrypt.compare(testPass, user.password);
            console.log(`Test login for ${testEmail}: ${match ? 'MATCH' : 'FAIL'}`);
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkUsers();
