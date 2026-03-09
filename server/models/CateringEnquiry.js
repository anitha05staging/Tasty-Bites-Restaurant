import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CateringEnquiry = sequelize.define('CateringEnquiry', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    eventType: { type: DataTypes.STRING, defaultValue: '' },
    eventDate: { type: DataTypes.STRING, defaultValue: '' },
    guests: { type: DataTypes.STRING, defaultValue: '' },
    budget: { type: DataTypes.STRING, defaultValue: '' },
    details: { type: DataTypes.TEXT, defaultValue: '' }
}, { timestamps: true });

export default CateringEnquiry;
