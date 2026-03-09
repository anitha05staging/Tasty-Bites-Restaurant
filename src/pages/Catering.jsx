import React from 'react';

const Catering = () => {
    return (
        <div className="page-container container">
            <section className="catering-page fade-in-up">
                <span className="section-subtitle">Events & Parties</span>
                <h1 className="section-title">Catering <span>Services</span></h1>
                <p className="lead-text">Perfect packages for your special events.</p>

                <div className="catering-grid mt-50">
                    <div className="catering-card">
                        <h3>Corporate Events</h3>
                        <p>Impress your colleagues with an authentic South Indian spread.</p>
                    </div>
                    <div className="catering-card">
                        <h3>Weddings & Parties</h3>
                        <p>Adding a touch of tradition to your most precious moments.</p>
                    </div>
                    <div className="catering-card">
                        <h3>Home Gatherings</h3>
                        <p>Freshly prepared food for your family get-togethers.</p>
                    </div>
                </div>

                <div className="contact-prompt mt-50 text-center">
                    <h3>Interested in our Catering?</h3>
                    <p>Get in touch with us for a custom quote.</p>
                    <a href="/contact" className="btn btn-primary">Enquire Now</a>
                </div>
            </section>
        </div>
    );
};

export default Catering;
