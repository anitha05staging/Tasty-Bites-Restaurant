import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const MenuItem = sequelize.define('MenuItem', {
    name: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, defaultValue: '' },
    price: { type: DataTypes.FLOAT, allowNull: false },
    image: { type: DataTypes.STRING, defaultValue: '' },
    popular: { type: DataTypes.BOOLEAN, defaultValue: false },
    vegetarian: { type: DataTypes.BOOLEAN, defaultValue: false },
    dairyFree: { type: DataTypes.BOOLEAN, defaultValue: false },
    glutenFree: { type: DataTypes.BOOLEAN, defaultValue: false },
    type: { type: DataTypes.ENUM('veg', 'nonveg'), defaultValue: 'veg' }
}, { timestamps: true });

export default MenuItem;
