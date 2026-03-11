import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Modal.css';

const Modal = ({ item, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    if (!item) return null;

    const handleIncrement = () => setQuantity(prev => prev + 1);
    const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const handleAddToCart = () => {
        addToCart(item, quantity);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content bg-white" onClick={(e) => e.stopPropagation()}>
                <button className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white hover:bg-red-50 text-gray-800 hover:text-red-500 rounded-full shadow-lg z-50 transition-colors text-3xl leading-none pb-1" onClick={onClose}>&times;</button>
                <div className="modal-body text-gray-800">
                    <div className="modal-image">
                        <img src={item.image} alt={item.name} />
                    </div>
                    <div className="modal-info">
                        <span className="modal-category text-primary font-bold">Best Seller</span>
                        <h2 className="text-3xl font-playfair text-secondary my-3">{item.name}</h2>
                        <p className="modal-price text-2xl font-bold text-primary mb-4">{item.price}</p>
                        <p className="modal-description text-gray-600 mb-6">{item.description}</p>

                        <div className="modal-options mt-6 border-t border-gray-100 pt-6">
                            <h3 className="text-lg font-bold text-secondary mb-3">Customizations</h3>
                            <label className="flex items-center space-x-3 text-gray-700 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                                <input type="checkbox" className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary" />
                                <span>Extra Chutney</span>
                            </label>
                            <label className="flex items-center space-x-3 text-gray-700 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                                <input type="checkbox" className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary" />
                                <span>Spicier Sambar</span>
                            </label>
                        </div>

                        <div className="modal-footer mt-8 pt-6 border-t border-gray-100 flex justify-between items-center sm:flex-row flex-col space-y-4 sm:space-y-0">
                            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 bg-gray-50">
                                <button onClick={handleDecrement} className="text-2xl px-3 font-bold text-gray-600 hover:text-primary transition-colors leading-none">-</button>
                                <span className="mx-4 font-bold text-lg text-gray-800 min-w-[20px] text-center">{quantity}</span>
                                <button onClick={handleIncrement} className="text-2xl px-3 font-bold text-gray-600 hover:text-primary transition-colors leading-none">+</button>
                            </div>
                            <button className="btn-primary w-full sm:w-auto text-center" onClick={handleAddToCart}>Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
