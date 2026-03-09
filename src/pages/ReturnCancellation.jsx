import React from 'react';

const ReturnCancellation = () => {
    return (
        <div className="pt-32 pb-20 bg-brand-cream/50 min-h-screen">
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="font-playfair text-4xl md:text-5xl text-primary font-bold mb-8 text-center">Return & Cancellation Policy</h1>
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm space-y-8 text-secondary/80 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-playfair text-primary mb-4 font-semibold">1. Order Cancellations</h2>
                        <p>You may cancel your order at any time before the restaurant starts preparing it. To cancel an order, please contact us immediately by phone. If you cancel after we have started preparing the food, we cannot offer a refund.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-playfair text-primary mb-4 font-semibold">2. Refunds</h2>
                        <p>If you are not satisfied with your order due to an error on our part (e.g., incorrect item, missing item, or food quality issue), please contact us within 24 hours of receiving your order. We may require photographic evidence of the issue. A refund or replacement will be issued at our discretion.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-playfair text-primary mb-4 font-semibold">3. Processing Time</h2>
                        <p>Refunds will be processed back to the original method of payment within 3-5 business days. Please note that it may take additional time for your bank or credit card provider to post the refund to your account.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-playfair text-primary mb-4 font-semibold">4. Non-Refundable Items</h2>
                        <p>Gift cards, promotional offers, and certain designated items are generally non-refundable unless required by law. Delivery fees are non-refundable if the delivery was attempted and failed due to customer error (e.g., incorrect address provided).</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ReturnCancellation;
