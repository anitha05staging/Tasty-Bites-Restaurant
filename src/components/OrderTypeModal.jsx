import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Utensils, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const OrderTypeModal = ({ isOpen, onClose }) => {
    const { setOrderType, setTableNumber, orderType, tableNumber } = useCart();
    const navigate = useNavigate();
    const handleSelect = (type) => {
        setOrderType(type);
        setTableNumber(''); // Reset table number as it's no longer used in this modal
        onClose();
        if (type === 'Dine-In') {
            navigate('/dine-in-menu');
        } else {
            navigate('/menu');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden z-10 my-8"
                    >
                        {/* Header */}
                        <div className="bg-secondary p-6 sm:p-8 text-white relative">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                            <h2 className="text-2xl sm:text-3xl font-playfair mb-2">How would you like to order?</h2>
                            <p className="text-white/70 text-sm">Select your preference to see our available dishes.</p>
                        </div>

                        {/* Options */}
                        <div className="p-6 sm:p-8 space-y-4">
                            {/* Dine In */}
                            <div
                                className="group p-5 rounded-2xl border-2 border-gray-100 hover:border-primary/30 transition-all cursor-pointer hover:bg-primary/5"
                                onClick={() => handleSelect('Dine-In')}
                            >
                                <div className="flex items-center space-x-5">
                                    <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                        <Utensils size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-secondary">Dine In</h3>
                                        <p className="text-gray-500 text-sm tracking-wide">Enjoy your meal at our restaurant</p>
                                    </div>
                                    <ArrowRight size={24} className="text-gray-300 group-hover:text-primary transition-all" />
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 py-2 text-gray-300">
                                <div className="flex-1 h-px bg-gray-100"></div>
                                <span className="text-xs font-bold uppercase tracking-widest">or</span>
                                <div className="flex-1 h-px bg-gray-100"></div>
                            </div>

                            {/* Collection */}
                            <div
                                className="group p-5 rounded-2xl border-2 border-gray-100 hover:border-primary/30 transition-all cursor-pointer hover:bg-primary/5"
                                onClick={() => handleSelect('Collection')}
                            >
                                <div className="flex items-center space-x-5">
                                    <div className="w-14 h-14 bg-secondary text-white rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                        <ShoppingBag size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-secondary">Takeaway</h3>
                                        <p className="text-gray-500 text-sm tracking-wide">Order online & pick up</p>
                                    </div>
                                    <ArrowRight size={24} className="text-gray-300 group-hover:text-primary transition-all" />
                                </div>
                            </div>
                        </div>

                        {/* Footer Link */}
                        <div className="p-6 bg-gray-50/50 text-center border-t border-gray-100">
                            <button
                                onClick={() => {
                                    setOrderType('Collection');
                                    onClose();
                                    navigate('/menu');
                                }}
                                className="text-sm font-bold text-gray-400 hover:text-primary transition-colors flex items-center justify-center mx-auto"
                            >
                                Just want to browse the menu? <ArrowRight size={14} className="ml-1" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default OrderTypeModal;
