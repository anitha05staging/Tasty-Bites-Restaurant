import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Drumstick } from 'lucide-react';
import Modal from './Modal';
import './MenuPreview.css';

const dishes = [
    {
        id: 1,
        name: 'Classic Masala Dosa',
        description: 'Crispy rice and lentil crepe filled with spiced potato masala, served with sambar and chutneys.',
        price: '£8.50',
        image: '/images/masal-dosa.jpg',
        isVeg: true
    },
    {
        id: 2,
        name: 'Paneer Butter Dosa',
        description: 'Our signature dosa layered with creamy paneer butter masala for an indulgent experience.',
        price: '£9.95',
        image: '/images/paneer-dosa.png',
        isVeg: true
    },
    {
        id: 3,
        name: 'Mysore Masala Dosa',
        description: 'Spiced with a special red garlic chutney, this spicy favorite is a true Bangalore icon.',
        price: '£9.25',
        image: '/images/mysore-dosa.png',
        isVeg: true
    }
];

const VegIcon = ({ isVeg }) => (
    <div className={`flex items-center justify-center w-8 h-8 rounded-md text-white absolute top-4 left-4 z-10 shadow-[0_2px_4px_rgba(0,0,0,0.2)] ${isVeg ? 'bg-[#10b981]' : 'bg-[#ef4444]'}`}>
        {isVeg ? <Leaf size={18} strokeWidth={2.5} /> : <Drumstick size={18} strokeWidth={2.5} />}
    </div>
);

const MenuPreview = () => {
    const [selectedItem, setSelectedItem] = useState(null);

    return (
        <section id="menu" className="menu-preview">
            <div className="container">
                <div className="section-header text-center">
                    <span className="section-subtitle">Specially Curated</span>
                    <h2 className="section-title">Customer <span>Favorites</span></h2>
                </div>

                <div className="menu-grid mt-50">
                    {dishes.map((dish) => (
                        <div key={dish.id} className="menu-card fade-in-up">
                            <div className="dish-image-wrapper relative">
                                <img src={dish.image} alt={dish.name} className="dish-image" />
                                <VegIcon isVeg={dish.isVeg} />
                                <button
                                    className="add-to-cart-btn"
                                    onClick={() => setSelectedItem(dish)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                            <div className="dish-info">
                                <h3>{dish.name}</h3>
                                <p>{dish.description}</p>
                                <span className="dish-price">{dish.price}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-50">
                    <Link to="/menu" className="btn btn-primary">View Full Menu</Link>
                </div>
            </div>

            <Modal
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
            />
        </section>
    );
};

export default MenuPreview;
