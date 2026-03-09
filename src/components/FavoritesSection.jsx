import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, ArrowRight, Leaf, Drumstick } from 'lucide-react';
import Modal from './Modal';

const favorites = [
    {
        id: 1,
        name: 'Classic Masala Dosa',
        description: 'Crispy rice and lentil crepe with potato masala.', // Changed desc to description to match modal expectations
        price: '£8.50',
        image: '/images/masal-dosa.jpg',
        rating: 5,
        isVeg: true
    },
    {
        id: 2,
        name: 'Paneer Butter Dosa',
        description: 'Our signature dosa layered with creamy paneer butter masala for an indulgent experience.',
        price: '£9.95',
        image: '/images/paneer-dosa.png',
        rating: 5,
        isVeg: true
    },
    {
        id: 3,
        name: 'Mysore Masala Dosa',
        description: 'Spicy red chutney and potato filling fav.',
        price: '£9.25',
        image: '/images/mysore-dosa.png',
        rating: 5,
        isVeg: true
    }
];

const VegIcon = ({ isVeg }) => (
    <div className={`flex items-center justify-center w-8 h-8 rounded-md shadow-sm text-white ${isVeg ? 'bg-[#10b981]' : 'bg-[#ef4444]'}`}>
        {isVeg ? <Leaf size={18} strokeWidth={2.5} /> : <Drumstick size={18} strokeWidth={2.5} />}
    </div>
);

const FavoritesSection = () => {
    const [selectedItem, setSelectedItem] = useState(null);

    return (
        <section className="section-padding bg-brand-cream/50">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-primary font-semibold tracking-widest uppercase text-sm block mb-4"
                    >
                        Specially Curated
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-secondary font-playfair text-4xl md:text-5xl lg:text-6xl"
                    >
                        Customer <span className="text-primary font-playfair">Favorites</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {favorites.map((dish, idx) => (
                        <motion.div
                            key={dish.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                        >
                            <div className="relative h-72 overflow-hidden">
                                <img
                                    src={dish.image}
                                    alt={dish.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Veg/Non-Veg Badge */}
                                <div className="absolute top-4 left-4 z-10 shadow-sm">
                                    <VegIcon isVeg={dish.isVeg} />
                                </div>
                                <button
                                    onClick={() => setSelectedItem(dish)}
                                    className="absolute bottom-6 right-6 w-14 h-14 bg-white rounded-full flex items-center justify-center text-secondary shadow-lg transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 hover:bg-primary hover:text-white"
                                >
                                    <ShoppingBag size={22} />
                                </button>
                            </div>
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-playfair text-secondary group-hover:text-primary transition-colors">{dish.name}</h3>
                                    <span className="text-primary font-bold text-xl">{dish.price}</span>
                                </div>
                                <p className="text-brand-text-light text-sm leading-relaxed mb-6">
                                    {dish.description}
                                </p>
                                <div className="flex items-center text-accent">
                                    {[...Array(dish.rating)].map((_, i) => (
                                        <Star key={i} size={14} fill="currentColor" className="mr-1" />
                                    ))}
                                    <span className="text-brand-text-light text-xs ml-2">(48 Reviews)</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-center mt-20"
                >
                    <Link to="/menu" className="btn-primary group">
                        View Full Menu
                        <ArrowRight size={18} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>

            <Modal
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
            />
        </section>
    );
};

export default FavoritesSection;
