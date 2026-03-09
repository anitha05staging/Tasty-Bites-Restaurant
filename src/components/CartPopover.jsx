import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const CartPopover = () => {
    const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, subtotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleCheckout = () => {
        setIsCartOpen(false);
        if (user) {
            navigate('/checkout');
        } else {
            // Redirect to signup and store the intended destination
            navigate('/signup', { state: { from: '/checkout' } });
        }
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
                    />

                    {/* Cart Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-[70] flex flex-col"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-2xl font-playfair text-secondary flex items-center">
                                <ShoppingBag className="mr-3 text-primary" size={24} />
                                Your Order
                            </h2>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                                    <ShoppingBag size={48} className="opacity-20" />
                                    <p className="text-lg">Your cart is empty</p>
                                    <button
                                        onClick={() => {
                                            setIsCartOpen(false);
                                            navigate('/menu');
                                        }}
                                        className="text-primary font-semibold hover:underline"
                                    >
                                        Browse Menu
                                    </button>
                                </div>
                            ) : (
                                cartItems.map(item => (
                                    <motion.div layout key={item.id} className="flex space-x-4 bg-gray-50 p-4 rounded-2xl">
                                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl shadow-sm" />
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-semibold text-secondary leading-tight">{item.name}</h3>
                                                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                                <p className="text-primary font-bold mt-1 text-sm">{item.price}</p>
                                            </div>
                                            <div className="flex items-center space-x-3 mt-2">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-600 hover:text-primary border border-gray-200">
                                                    <Minus size={14} />
                                                </button>
                                                <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-600 hover:text-primary border border-gray-200">
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {cartItems.length > 0 && (
                            <div className="p-6 bg-gray-50 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-gray-600 font-medium">Subtotal</span>
                                    <span className="text-2xl font-bold text-secondary">£{subtotal.toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full btn-primary flex items-center justify-center space-x-2 py-4"
                                >
                                    <span>Proceed to Checkout</span>
                                    <ArrowRight size={18} />
                                </button>
                                <button
                                    onClick={clearCart}
                                    className="w-full text-center text-sm text-gray-400 mt-4 hover:text-gray-600 transition-colors"
                                >
                                    Empty Cart
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartPopover;
