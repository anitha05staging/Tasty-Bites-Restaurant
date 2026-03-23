import axios from 'axios';
let API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Ensure baseURL ends with a slash to work correctly with relative paths
if (!API_BASE_URL.endsWith('/')) {
    API_BASE_URL += '/';
}

const adminApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the JWT token in headers
adminApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const adminAuthApi = {
    login: async (email, password) => {
        const response = await adminApi.post('auth/login', { email, password });
        return response.data;
    },
    verify: async () => {
        const response = await adminApi.get('auth/me');
        return response.data;
    }
};

export const adminOrdersApi = {
    getAll: async () => {
        const response = await adminApi.get('orders/admin/all');
        return response.data;
    },
    updateStatus: async (orderId, status) => {
        const response = await adminApi.patch(`orders/${orderId}/status`, { status });
        return response.data;
    },
    getStats: async () => {
        const response = await adminApi.get('orders/admin/stats/summary');
        return response.data;
    },
    update: async (orderId, data) => {
        const response = await adminApi.put(`orders/${orderId}`, data);
        return response.data;
    }
};

export const adminMenuApi = {
    getAll: async () => {
        const response = await adminApi.get('menu');
        return response.data;
    },
    getCategories: async () => {
        const response = await adminApi.get('categories');
        return response.data;
    },
    create: async (itemData) => {
        const response = await adminApi.post('menu', itemData);
        return response.data;
    },
    update: async (id, itemData) => {
        const response = await adminApi.put(`menu/${id}`, itemData);
        return response.data;
    },
    delete: async (id) => {
        const response = await adminApi.delete(`menu/${id}`);
        return response.data;
    }
};

export const adminCategoriesApi = {
    getAll: async () => {
        const response = await adminApi.get('categories');
        return response.data;
    },
    create: async (data) => {
        const response = await adminApi.post('categories', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await adminApi.put(`categories/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await adminApi.delete(`categories/${id}`);
        return response.data;
    }
};

export const adminReservationsApi = {
    getAll: async () => {
        const response = await adminApi.get('reservations/admin/all');
        return response.data;
    },
    updateStatus: async (id, status) => {
        const response = await adminApi.patch(`reservations/${id}/status`, { status });
        return response.data;
    }
};

export const adminTestimonialsApi = {
    getAll: async () => {
        const response = await adminApi.get('testimonials/admin/all');
        return response.data;
    },
    update: async (id, data) => {
        const response = await adminApi.put(`testimonials/${id}`, data);
        return response.data;
    },
    create: async (data) => {
        const response = await adminApi.post('testimonials', data);
        return response.data;
    },
    delete: async (id) => {
        const response = await adminApi.delete(`testimonials/${id}`);
        return response.data;
    }
};

export const adminCateringApi = {
    getAll: async () => {
        const response = await adminApi.get('catering/admin/all');
        return response.data;
    },
    updateStatus: async (id, status) => {
        const response = await adminApi.patch(`catering/${id}/status`, { status });
        return response.data;
    }
};

export default adminApi;
