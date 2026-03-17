import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Category = sequelize.define('Category', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, defaultValue: '' },
    image: { type: DataTypes.TEXT, defaultValue: '' },
    active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { 
    timestamps: true,
    freezeTableName: true,
    tableName: 'categories'
});

export default Category;
