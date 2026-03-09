/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#C04B2A', // Terracotta
                    dark: '#A03D22',
                },
                secondary: {
                    DEFAULT: '#3B2F2F', // Dark Wood
                },
                accent: {
                    DEFAULT: '#E5C76B', // Brass
                    light: '#F4E4AD',
                },
                brand: {
                    cream: '#FDF5E6',
                    'text-dark': '#222222',
                    'text-light': '#666666',
                }
            },
            fontFamily: {
                'playfair': ['"Playfair Display"', 'serif'],
                'poppins': ['"Poppins"', 'sans-serif'],
            },
            boxShadow: {
                'premium': '0 10px 40px rgba(0, 0, 0, 0.08)',
            }
        },
    },
    plugins: [],
}
