import React from 'react';

const TermsConditions = () => {
    return (
        <div className="pt-32 pb-20 bg-brand-cream/50 min-h-screen">
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="font-playfair text-4xl md:text-5xl text-primary font-bold mb-8 text-center">Terms & Conditions</h1>
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm space-y-8 text-secondary/80 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-playfair text-primary mb-4 font-semibold">1. Acceptance of Terms</h2>
                        <p>By accessing and using the Tasty Bites website, you agree to comply with and be bound by these Terms & Conditions. If you disagree with any part of these terms, please do not use our website.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-playfair text-primary mb-4 font-semibold">2. Online Ordering</h2>
                        <p>When placing an order through our website, you warrant that you are legally capable of entering into binding contracts. All orders are subject to acceptance by us, and we will confirm such acceptance by sending you an email or SMS notification.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-playfair text-primary mb-4 font-semibold">3. Pricing and Payment</h2>
                        <p>All prices are quoted in the local currency and are inclusive of applicable taxes unless stated otherwise. Delivery costs will be added to the total amount due as set out in our delivery guide. Payment must be made by credit/debit card or other accepted payment methods at the time of order.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-playfair text-primary mb-4 font-semibold">4. User Accounts</h2>
                        <p>To access certain features of the site, you may be required to register for an account. You are responsible for maintaining the confidentiality of your account information, including your password, and for all activity that occurs under your account.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsConditions;
