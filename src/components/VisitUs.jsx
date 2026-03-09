import React from 'react';
import './VisitUs.css';

const VisitUs = () => {
    return (
        <section id="contact" className="visit-us">
            <div className="container">
                <div className="visit-grid">
                    <div className="visit-info fade-in-up">
                        <span className="section-subtitle">Our Location</span>
                        <h2 className="section-title">Visit <span>Us</span></h2>

                        <div className="contact-details mt-30">
                            <div className="detail-row">
                                <h3>Tasty Bites London</h3>
                                <p>123 High Street, Kensington, London W8 5SF</p>
                            </div>

                            <div className="detail-row mt-20">
                                <h3>Opening Hours</h3>
                                <p>Mon - Thu: 11:30 AM - 10:00 PM</p>
                                <p>Fri - Sat: 11:30 AM - 11:00 PM</p>
                                <p>Sun: 12:00 PM - 10:00 PM</p>
                            </div>

                            <div className="detail-row mt-20">
                                <h3>WhatsApp Contact</h3>
                                <p>+44 7384 048311</p>
                            </div>

                            <div className="visit-btns mt-30">
                                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Get Directions</a>
                                <a href="/contact" className="btn btn-outline ml-20">Contact Us</a>
                            </div>
                        </div>
                    </div>

                    <div className="visit-map fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <img src="/src/assets/images/about-img.png" alt="Restaurant Interior" className="map-placeholder-img" />
                        <div className="map-overlay">
                            <span>View on Maps</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VisitUs;
