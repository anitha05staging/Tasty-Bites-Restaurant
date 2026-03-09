import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Address = sequelize.define('Address', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM('home', 'work', 'other'), defaultValue: 'home' },
    line1: { type: DataTypes.STRING, allowNull: false },
    line2: { type: DataTypes.STRING, defaultValue: '' },
    landmark: { type: DataTypes.STRING, defaultValue: '' },
    city: { type: DataTypes.STRING, allowNull: false },
    state: { type: DataTypes.STRING, defaultValue: '' },
    zip: { type: DataTypes.STRING, allowNull: false }
}, { timestamps: true });

export default Address;
