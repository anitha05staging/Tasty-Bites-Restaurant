import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const localData = localStorage.getItem('tastybites_cart');
        return localData ? JSON.parse(localData) : [];
    });

    const [orderType, setOrderType] = useState(() => {
        return localStorage.getItem('tastybites_orderType') || 'Collection';
    });

    const [tableNumber, setTableNumber] = useState(() => {
        return localStorage.getItem('tastybites_tableNumber') || '';
    });

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isOrderTypeModalOpen, setIsOrderTypeModalOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('tastybites_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem('tastybites_orderType', orderType);
    }, [orderType]);

    useEffect(() => {
        localStorage.setItem('tastybites_tableNumber', tableNumber);
    }, [tableNumber]);

    const addToCart = (item, quantity = 1) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i);
            }
            return [...prev, { ...item, quantity }];
        });
        setIsCartOpen(true);
    };

    const updateQuantity = (id, delta) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const subtotal = cartItems.reduce((sum, item) => {
        // Parse float from string like '£8.50'
        const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
        return sum + (price * item.quantity);
    }, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            subtotal,
            isCartOpen,
            setIsCartOpen,
            cartCount: cartItems.reduce((acc, item) => acc + item.quantity, 0),
            orderType,
            setOrderType,
            tableNumber,
            setTableNumber,
            isOrderTypeModalOpen,
            setIsOrderTypeModalOpen
        }}>
            {children}
        </CartContext.Provider>
    );
};
