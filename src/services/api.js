// Centralized API service with JWT token handling
const API_BASE = '/api';

const getToken = () => localStorage.getItem('tastybites_token');

const request = async (endpoint, options = {}) => {
    const token = getToken();
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    let data;
    try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
    } catch (err) {
        data = { error: 'Network or parsing error occurred' };
    }

    if (!response.ok) {
        throw new Error(data.error || `Request failed with status ${response.status}`);
    }
    return data;
};

// Auth
export const api = {
    // Auth
    login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    signup: (userData) => request('/auth/signup', { method: 'POST', body: JSON.stringify(userData) }),
    getMe: () => request('/auth/me'),
    updateProfile: (updates) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(updates) }),

    // Menu
    getMenu: () => request('/menu'),
    getMenuItem: (id) => request(`/menu/${id}`),

    // Orders
    createOrder: (orderData) => request('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
    getOrders: () => request('/orders'),
    getOrder: (orderId) => request(`/orders/${orderId}`),

    // Reservations
    createReservation: (data) => request('/reservations', { method: 'POST', body: JSON.stringify(data) }),
    getReservations: () => request('/reservations'),

    // Addresses
    getAddresses: () => request('/addresses'),
    createAddress: (data) => request('/addresses', { method: 'POST', body: JSON.stringify(data) }),
    updateAddress: (id, data) => request(`/addresses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteAddress: (id) => request(`/addresses/${id}`, { method: 'DELETE' }),

    // Contact
    submitContact: (data) => request('/contact', { method: 'POST', body: JSON.stringify(data) }),

    // Catering
    submitCatering: (data) => request('/catering', { method: 'POST', body: JSON.stringify(data) }),

    // Testimonials
    getTestimonials: () => request('/testimonials'),
    submitTestimonial: (data) => request('/testimonials', { method: 'POST', body: JSON.stringify(data) }),

    // FAQs
    getFaqs: () => request('/faqs'),
};

export default api;
