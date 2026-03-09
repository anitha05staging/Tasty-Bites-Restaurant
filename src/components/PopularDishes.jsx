import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Drumstick } from 'lucide-react';

const popularDishes = [
    { id: 1, name: 'Mini Ghee Podi Idli', price: '£6.25', image: '/src/assets/images/idly.jpg', isVeg: true },
    { id: 2, name: 'Medhu Vada', price: '£5.95', image: '/src/assets/images/Vadai.jpg', isVeg: true },
    { id: 3, name: 'Chicken 65', price: '£8.50', image: '/src/assets/images/chicken 65.jpg', isVeg: false },
    { id: 4, name: 'Paneer 65', price: '£7.50', image: '/src/assets/images/Paneer 65.jpg', isVeg: true },
];

const VegIcon = ({ isVeg }) => (
    <div className={`flex items-center justify-center w-8 h-8 rounded-md shadow-sm text-white ${isVeg ? 'bg-[#10b981]' : 'bg-[#ef4444]'}`}>
        {isVeg ? <Leaf size={18} strokeWidth={2.5} /> : <Drumstick size={18} strokeWidth={2.5} />}
    </div>
);

const PopularDishes = () => {
    return (
        <section className="section-padding bg-white">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 px-4">
                    <div className="max-w-xl">
                        <span className="text-primary font-semibold tracking-widest uppercase text-sm block mb-4">Trending Now</span>
                        <h2 className="text-secondary font-playfair text-4xl md:text-5xl leading-tight">
                            Most Popular <span className="text-primary italic">Side Delights</span>
                        </h2>
                    </div>
                    <p className="text-brand-text-light max-w-sm mt-6 md:mt-0">
                        Complement your meal with our authentic starters and traditional sides.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {popularDishes.map((dish, idx) => (
                        <motion.div
                            key={dish.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group cursor-pointer"
                        >
                            <div className="relative aspect-square overflow-hidden rounded-2xl mb-6 shadow-md">
                                <img
                                    src={dish.image}
                                    alt={dish.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Veg/Non-Veg Badge */}
                                <div className="absolute top-4 left-4 z-10 shadow-sm">
                                    <VegIcon isVeg={dish.isVeg} />
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-secondary mb-1 group-hover:text-primary transition-colors flex items-center justify-center gap-2">
                                    {dish.name}
                                </h3>
                                <span className="text-primary font-bold">{dish.price}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PopularDishes;
