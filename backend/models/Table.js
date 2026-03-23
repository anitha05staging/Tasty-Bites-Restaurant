import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Table = sequelize.define('Table', {
    number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 2
    },
    status: {
        type: DataTypes.ENUM('Available', 'Occupied', 'Reserved'),
        defaultValue: 'Available'
    },
    location: {
        type: DataTypes.ENUM('Indoor', 'Outdoor', 'Balcony'),
        defaultValue: 'Indoor'
    },
    currentOrderId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    waiterId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    timestamps: true,
    freezeTableName: true,
    tableName: 'tables'
});

export default Table;
