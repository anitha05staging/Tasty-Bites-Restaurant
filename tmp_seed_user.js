import { sequelize, User } from './backend/models/index.js';
import bcrypt from 'bcryptjs';

async function seedTestUser() {
    try {
        await sequelize.authenticate();
        console.log('Connected to database.');
        
        const testEmail = 'user@tastybites.com';
        const hashedPassword = await bcrypt.hash('user123', 10);
        
        const [user, created] = await User.findOrCreate({
            where: { email: testEmail },
            defaults: {
                name: 'Test User',
                email: testEmail,
                password: hashedPassword,
                phone: '+44 1234 567890',
                role: 'user'
            }
        });

        if (created) {
            console.log(`✅ Test user created: ${testEmail} / user123`);
        } else {
            console.log(`ℹ️ Test user already exists: ${testEmail}`);
            // Force update password just in case
            user.password = hashedPassword;
            await user.save();
            console.log('✅ Test user password updated.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

seedTestUser();
