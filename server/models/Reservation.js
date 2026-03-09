import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Reservation = sequelize.define('Reservation', {
    userId: { type: DataTypes.INTEGER, allowNull: true },
    fullName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.STRING, allowNull: false },
    time: { type: DataTypes.STRING, defaultValue: '19:00' },
    guests: { type: DataTypes.STRING, allowNull: false },
    occasion: { type: DataTypes.STRING, defaultValue: 'None' },
    specialRequests: { type: DataTypes.TEXT, defaultValue: '' },
    status: { type: DataTypes.ENUM('Upcoming', 'Past', 'Cancelled'), defaultValue: 'Upcoming' },
    bookingRef: { type: DataTypes.STRING, unique: true }
}, { timestamps: true });

export default Reservation;
