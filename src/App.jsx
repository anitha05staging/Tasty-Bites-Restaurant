import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import TestimonialsPage from './pages/TestimonialsPage';
import MenuPage from './pages/MenuPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import BookTable from './pages/BookTable';
import CateringPage from './pages/CateringPage';
import FAQs from './pages/FAQs';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import ReturnCancellation from './pages/ReturnCancellation';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import CartPopover from './components/CartPopover';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <div className="min-h-screen bg-brand-cream font-poppins selection:bg-primary/30 selection:text-primary">
                        <Navbar />
                        <CartPopover />

                        <main>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/contact" element={<Contact />} />
                                <Route path="/testimonials" element={<TestimonialsPage />} />
                                <Route path="/menu" element={<MenuPage />} />
                                <Route path="/checkout" element={<CheckoutPage />} />
                                <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                                <Route path="/book" element={<BookTable />} />
                                <Route path="/catering" element={<CateringPage />} />
                                <Route path="/faqs" element={<FAQs />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/signup" element={<SignupPage />} />
                                <Route path="/profile" element={<ProfilePage />} />
                                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                                <Route path="/terms-conditions" element={<TermsConditions />} />
                                <Route path="/return-cancellation" element={<ReturnCancellation />} />
                            </Routes>
                        </main>

                        <Footer />
                    </div>
                </Router>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                    toastStyle={{ backgroundColor: '#C04B2A' }}
                />
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
