import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import DineInMenuPage from './pages/DineInMenuPage';
import { CartProvider, useCart } from './context/CartContext';
import { UserAuthProvider } from './context/AuthContext';
import { RestaurantProvider } from './context/RestaurantContext';
import CartPopover from './components/CartPopover';
import OrderTypeModal from './components/OrderTypeModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import AdminApp from './admin/AdminApp';

const AppContent = () => {
    const { isOrderTypeModalOpen, setIsOrderTypeModalOpen } = useCart();
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');

    return (
        <>
            <div className="min-h-screen bg-slate-50 font-poppins selection:bg-primary/30 selection:text-primary">
                {!isAdmin && <Navbar />}
                {!isAdmin && <CartPopover />}

                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/testimonials" element={<TestimonialsPage />} />
                        <Route path="/menu" element={<MenuPage />} />
                        <Route path="/dine-in-menu" element={<DineInMenuPage />} />
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
                        <Route path="/admin/*" element={<AdminApp />} />
                    </Routes>
                </main>

                {!isAdmin && <Footer />}
            </div>

            {!isAdmin && (
                <OrderTypeModal
                    isOpen={isOrderTypeModalOpen}
                    onClose={() => setIsOrderTypeModalOpen(false)}
                />
            )}
        </>
    );
};

function App() {
    return (
        <UserAuthProvider>
            <RestaurantProvider>
                <CartProvider>
                    <Router>
                        <AppContent />
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
                    </Router>
                </CartProvider>
            </RestaurantProvider>
        </UserAuthProvider>
    );
}

export default App;
