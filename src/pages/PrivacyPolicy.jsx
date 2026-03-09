import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="pt-32 pb-20 bg-brand-cream/50 min-h-screen">
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="font-playfair text-4xl md:text-5xl text-primary font-bold mb-8 text-center">Privacy Policy</h1>
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm space-y-8 text-secondary/80 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-playfair text-primary mb-4 font-semibold">1. Introduction</h2>
                        <p>Welcome to Tasty Bites. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-playfair text-primary mb-4 font-semibold">2. The Data We Collect About You</h2>
                        <p>Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows: Identity Data, Contact Data, Financial Data, Transaction Data, Technical Data, Profile Data, Usage Data, and Marketing and Communications Data.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-playfair text-primary mb-4 font-semibold">3. How We Use Your Personal Data</h2>
                        <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances: Where we need to perform the contract we are about to enter into or have entered into with you. Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests. Where we need to comply with a legal obligation.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-playfair text-primary mb-4 font-semibold">4. Data Security</h2>
                        <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
