import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const FAQ = sequelize.define('FAQ', {
    category: { type: DataTypes.STRING, allowNull: false },
    question: { type: DataTypes.STRING, allowNull: false },
    answer: { type: DataTypes.TEXT, allowNull: false }
}, { timestamps: true });

export default FAQ;
