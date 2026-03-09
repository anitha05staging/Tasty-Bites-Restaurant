import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Testimonial = sequelize.define('Testimonial', {
    name: { type: DataTypes.STRING, allowNull: false },
    text: { type: DataTypes.TEXT, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
    type: { type: DataTypes.STRING, defaultValue: 'General' },
    date: { type: DataTypes.STRING, allowNull: false }, // Store as formatted string like 'October 2025'
    approved: { type: DataTypes.BOOLEAN, defaultValue: true } // Auto-approve for demo
}, { timestamps: true });

export default Testimonial;
