import bcrypt from 'bcryptjs';
import { sequelize, User, MenuItem, Testimonial, FAQ } from './models/index.js';
import { fileURLToPath } from 'url';

export const seed = async (exitOnComplete = false) => {
    try {
        console.log('🌱 Seeding database...');
        await sequelize.sync({ force: true });

        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            name: 'Tasty Bites Admin',
            email: 'admin@tastybites.com',
            password: hashedPassword,
            phone: '+44 7384 048311',
            role: 'admin'
        });
        console.log('✅ Admin user created (admin@tastybites.com / admin123)');

        // Seed menu items
        const menuItems = [
            { name: 'Classic Masala Dosa', category: 'veg', description: 'Crispy rice and lentil crepe with potato masala.', price: 8.50, image: '/images/masal-dosa.jpg', popular: true, vegetarian: true, dairyFree: false, glutenFree: true, type: 'veg' },
            { name: 'Chicken Tikka Dosa', category: 'non-veg', description: 'Spicy chicken tikka stuffed in a crispy dosa.', price: 10.95, image: '/images/chicken-65.jpg', popular: true, vegetarian: false, dairyFree: true, glutenFree: true, type: 'nonveg' },
            { name: 'Mysore Masala Dosa', category: 'signatures', description: 'Spicy red chutney with potato filling.', price: 9.25, image: '/images/mysore-dosa.png', popular: true, vegetarian: true, dairyFree: false, glutenFree: true, type: 'veg' },
            { name: 'Chettinad Fish Curry', category: 'sea food', description: 'Traditional spicy fish curry from Chettinad.', price: 14.50, image: '/images/prawns-&-egg-curry--bagara-rice--1-drink.jpg', popular: false, vegetarian: false, dairyFree: true, glutenFree: true, type: 'nonveg' },
            { name: 'Paneer Butter Masala', category: 'curries', description: 'Cottage cheese in rich tomato gravy.', price: 11.95, image: '/images/paneer-butter-masala.jpg', popular: true, vegetarian: true, dairyFree: false, glutenFree: true, type: 'veg' },
            { name: 'Hyderabadi Chicken Biriyani', category: 'Biriyani', description: 'Aromatic basmati rice cooked with spiced chicken.', price: 13.50, image: '/images/chicken-briyani.jpg', popular: true, vegetarian: false, dairyFree: true, glutenFree: true, type: 'nonveg' },
            { name: 'Lemon Rice', category: 'rice and breads', description: 'Tangy lemon-flavored basmati rice.', price: 5.50, image: '/images/ghee-rice.jpg', popular: false, vegetarian: true, dairyFree: true, glutenFree: true, type: 'veg' },
            { name: 'Kerala Parotta', category: 'Parotta and Idiyappam', description: 'Flaky, layered flatbread from Kerala.', price: 3.50, image: '/images/onion-pakoda.jpg', popular: true, vegetarian: true, dairyFree: false, glutenFree: false, type: 'veg' },
            { name: 'String Hoppers (Idiyappam)', category: 'Parotta and Idiyappam', description: 'Steamed rice flour noodles.', price: 4.50, image: '/images/medhu-vada.jpg', popular: false, vegetarian: true, dairyFree: true, glutenFree: true, type: 'veg' },
            { name: 'Mutton Chukka', category: 'non-veg', description: 'Dry roasted spicy mutton chunks.', price: 15.50, image: '/images/gongura-mutton.jpg', popular: true, vegetarian: false, dairyFree: true, glutenFree: true, type: 'nonveg' }
        ];

        await MenuItem.bulkCreate(menuItems);
        console.log(`✅ ${menuItems.length} menu items seeded`);

        // Seed Testimonials
        const testimonials = [
            { name: 'James Wilson', text: 'Stunning presentation and even better tastes! The Mysore Dosa is a masterpiece of spice and crunch.', rating: 5, date: 'October 2025' },
            { name: 'Emma Watson', text: 'Finally, a place that gets the sambar right. Tastes exactly like home in Tamil Nadu.', rating: 5, date: 'September 2025' },
            { name: 'Sanjay Gupta', text: 'Great atmosphere for a weekend dinner. The filter coffee is a must-try after the meal.', rating: 4, date: 'August 2025' },
            { name: 'Rebecca Low', text: 'Quick service and lovely staff. The Paneer Dosa was so cheesy and satisfying.', rating: 5, date: 'July 2025' },
            { name: 'Liam Davies', text: 'Best South Indian food in London, hands down. Fair prices for high quality.', rating: 5, date: 'June 2025' },
            { name: 'Priya Raj', text: 'Authentic flavors, beautiful decor, and a warm welcome. Will be a regular here!', rating: 5, date: 'May 2025' },
        ];
        await Testimonial.bulkCreate(testimonials);
        console.log(`✅ ${testimonials.length} testimonials seeded`);

        // Seed FAQs
        const faqs = [
            { category: 'General', question: 'What are your opening hours?', answer: 'We are open from 11:30 AM to 10:00 PM on weekdays, and until 11:00 PM on weekends (Friday & Saturday). We are closed on Mondays.' },
            { category: 'General', question: 'Where are you located?', answer: 'We are located at 123 High Street, London. You can find us on Google Maps by searching for "Tasty Bites London".' },
            { category: 'General', question: 'Do I need to make a reservation?', answer: 'Reservations are recommended, especially on weekends, but walk-ins are always welcome subject to availability.' },
            { category: 'General', question: 'Is there parking available?', answer: 'There is street parking available nearby, and a public car park within a 2-minute walk from the restaurant.' },
            { category: 'Orders & Delivery', question: 'Do you offer home delivery?', answer: 'Yes! We deliver through our website and major platforms like Deliveroo and Uber Eats in selected areas within a 5-mile radius.' },
            { category: 'Orders & Delivery', question: 'What is the minimum order for delivery?', answer: 'The minimum order for free delivery is £20. A £2.50 delivery charge applies for orders below this amount.' },
            { category: 'Orders & Delivery', question: 'How long does delivery usually take?', answer: 'Delivery typically takes 30-45 minutes depending on your distance from the restaurant and current order volume.' },
            { category: 'Orders & Delivery', question: 'Can I schedule an order for later?', answer: 'Yes, you can schedule an order for collection or delivery at a preferred time through our ordering page.' },
            { category: 'Menu & Dietary', question: 'Do you offer gluten-free options?', answer: 'Yes, many of our dosas and idlis are naturally gluten-free as they are made from rice and lentil batter. Look for the "Gluten-free" tag on our menu.' },
            { category: 'Menu & Dietary', question: 'Are there vegan options available?', answer: 'Absolutely! A large portion of our menu is vegan-friendly. Our staff can guide you through the best vegan choices.' },
            { category: 'Menu & Dietary', question: 'Do you handle nut allergies?', answer: 'We take allergies very seriously. Please inform your server or note it in your order. While we do use nuts in some dishes, we take precautions to avoid cross-contamination.' },
            { category: 'Menu & Dietary', question: 'Can I customize spice levels?', answer: 'Yes! Most dishes can be adjusted to your preferred spice level—from mild to extra hot. Just let us know when ordering.' },
            { category: 'Account & Payment', question: 'What payment methods do you accept?', answer: 'We accept all major credit/debit cards (Visa, Mastercard, Amex), Apple Pay, Google Pay, and cash.' },
            { category: 'Account & Payment', question: 'Do you have a loyalty program?', answer: 'We are launching a loyalty rewards program soon! Sign up for our newsletter to be the first to know.' },
            { category: 'Account & Payment', question: 'Can I get a receipt for my order?', answer: 'Yes, receipts are automatically emailed to you for online orders. For dine-in, just ask your server.' },
            { category: 'Returns & Refunds', question: 'What is your refund policy?', answer: 'If there is an issue with your order, please contact us within 30 minutes of delivery. We will offer a replacement or full refund for any incorrect or unsatisfactory items.' },
            { category: 'Returns & Refunds', question: 'What if my order is missing an item?', answer: 'Please contact us immediately and we will arrange for the missing item to be delivered or issue a refund for that item.' },
            { category: 'Returns & Refunds', question: 'Can I cancel my order?', answer: 'Orders can be cancelled within 5 minutes of placement. After that, the kitchen may have already started preparing your food.' }
        ];
        await FAQ.bulkCreate(faqs);
        console.log(`✅ ${faqs.length} FAQs seeded`);

        console.log('\n🎉 Database seeded successfully!');
        if (exitOnComplete) process.exit(0);
    } catch (err) {
        console.error('❌ Seed error:', err);
        if (exitOnComplete) process.exit(1);
        throw err;
    }
};

// Check if file is being run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    seed(true);
}
