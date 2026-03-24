import sequelize from '../config/database.js';
import User from './User.js';
import MenuItem from './MenuItem.js';
import Order from './Order.js';
import Reservation from './Reservation.js';
import Address from './Address.js';
import ContactMessage from './ContactMessage.js';
import CateringEnquiry from './CateringEnquiry.js';
import Testimonial from './Testimonial.js';
import FAQ from './FAQ.js';
import RestaurantInfo from './RestaurantInfo.js';
import Table from './Table.js';

// Associations
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Reservation, { foreignKey: 'userId' });
Reservation.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Address, { foreignKey: 'userId' });
Address.belongsTo(User, { foreignKey: 'userId' });

Table.belongsTo(User, { as: 'waiter', foreignKey: 'waiterId' });
User.hasMany(Table, { foreignKey: 'waiterId' });

export { sequelize, User, MenuItem, Order, Reservation, Address, ContactMessage, CateringEnquiry, Testimonial, FAQ, RestaurantInfo, Table };
