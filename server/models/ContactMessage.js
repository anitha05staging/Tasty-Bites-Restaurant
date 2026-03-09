import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ContactMessage = sequelize.define('ContactMessage', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, defaultValue: '' },
    subject: { type: DataTypes.STRING, defaultValue: 'General Inquiry' },
    message: { type: DataTypes.TEXT, allowNull: false }
}, { timestamps: true });

export default ContactMessage;
