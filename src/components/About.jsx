import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';
import aboutImg from '../assets/about-img.png';

const About = () => {
    return (
        <section id="about" className="about container">
            <div className="about-grid">
                <div className="about-image fade-in-up">
                    <img src={aboutImg} alt="Traditional Dosa Making" />
                    <div className="about-img-accent"></div>
                </div>
                <div className="about-content fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <span className="section-subtitle">Since Generations</span>
                    <h2 className="section-title">A Legacy of <br /><span>Authentic Flavours</span></h2>
                    <p>
                        For generations, our families have perfected the art of South Indian cooking in the heart of South India. Now, we bring those same time-honoured recipes to you.
                    </p>
                    <p>
                        Every dosa is made from batter fermented overnight. Every sambar carries the essence of hand-ground spices. Every meal is a bridge between two worlds, crafted with love and tradition.
                    </p>
                    <Link to="/about" className="btn btn-outline">Learn More About Us</Link>
                </div>
            </div>
        </section>
    );
};

export default About;
