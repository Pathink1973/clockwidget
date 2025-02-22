/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
      },
    },
  },
  plugins: [],
  safelist: [
    'text-orange-500',
    'text-red-500',
    'text-green-500',
    'text-blue-500',
    'bg-orange-600',
    'bg-red-600',
    'bg-green-600',
    'bg-blue-600',
    'hover:bg-orange-700',
    'hover:bg-red-700',
    'hover:bg-green-700',
    'hover:bg-blue-700',
  ],
};