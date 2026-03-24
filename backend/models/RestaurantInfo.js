import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const RestaurantInfo = sequelize.define('RestaurantInfo', {
    name: {
        type: DataTypes.STRING,
        defaultValue: 'Tasty Bites'
    },
    address: {
        type: DataTypes.STRING,
        defaultValue: '123 Curry Lane, London, SE1 7PB'
    },
    phone: {
        type: DataTypes.STRING,
        defaultValue: '+44 20 7946 0123'
    },
    email: {
        type: DataTypes.STRING,
        defaultValue: 'tastybitesrestaurant7@gmail.com'
    },
    website: {
        type: DataTypes.STRING,
        defaultValue: 'www.tastybites-uk.com'
    },
    description: {
        type: DataTypes.TEXT,
        defaultValue: 'Authentic South Indian cuisine serving the heart of London with traditional recipes and modern flair.'
    },
    logo: {
        type: DataTypes.TEXT, // Using TEXT for base64 or long URLs
        allowNull: true
    },
    openingHours: {
        type: DataTypes.JSON, // { open: '11:00', close: '22:30', days: 'Mon-Sun' }
        defaultValue: { open: '11:00', close: '22:30', days: 'Mon-Sun' }
    }
});

export default RestaurantInfo;
