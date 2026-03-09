import React from 'react';

const LegalPage = ({ title }) => {
    return (
        <div className="page-container container">
            <section className="legal-content fade-in-up">
                <h1 className="section-title">{title}</h1>
                <div className="legal-text mt-50">
                    <p>This is a placeholder for the {title} content.
                        Tasty Bites is committed to transparency and providing clear terms for our customers.</p>
                    <p>Please check the original website for the full official legal documentation.</p>

                    <h3>Section 1: Introduction</h3>
                    <p>Details regarding the {title} and how it applies to your use of our services.</p>

                    <h3>Section 2: Our Commitment</h3>
                    <p>We take our responsibility towards our customers seriously, ensuring a high-quality experience.</p>
                </div>
            </section>
        </div>
    );
};

export default LegalPage;
