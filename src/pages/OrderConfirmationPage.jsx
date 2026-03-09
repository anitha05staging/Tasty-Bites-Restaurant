import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useLocation, Link, Navigate } from 'react-router-dom';

const OrderConfirmationPage = () => {
    const location = useLocation();

    // Redirect if no order id (e.g. someone navigated here directly)
    if (!location.state?.orderId) {
        return <Navigate to="/" replace />;
    }

    const { orderId } = location.state;

    return (
        <div className="min-h-screen bg-brand-cream pt-32 pb-24 flex items-center justify-center">
            <div className="container mx-auto px-6 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl mx-auto bg-white rounded-3xl p-10 lg:p-14 text-center shadow-xl relative overflow-hidden"
                >
                    {/* Decorative background element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"
                    >
                        <CheckCircle2 size={48} />
                    </motion.div>

                    <h1 className="text-4xl md:text-5xl font-playfair text-secondary mb-4">Order Confirmed!</h1>
                    <p className="text-brand-text-light text-lg mb-8 max-w-md mx-auto">
                        Thank you for your order. We've received it and the kitchen is preparing your authentic South Indian meal.
                    </p>

                    <div className="bg-brand-cream/50 rounded-2xl p-6 mb-10 border border-brand-cream">
                        <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold mb-2">Your Order ID</p>
                        <p className="text-3xl font-mono font-bold text-primary tracking-wider">#{orderId}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <Link to="/" className="w-full sm:w-auto px-8 py-3 bg-white border border-gray-200 text-secondary rounded-full font-semibold uppercase tracking-wider text-sm hover:bg-gray-50 transition-all text-center">
                            Back to Home
                        </Link>
                        <Link to="/menu" className="btn-primary w-full sm:w-auto text-center flex justify-center items-center group">
                            Order More
                            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;
