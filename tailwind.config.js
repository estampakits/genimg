/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#040d21', // Deep space blue from DESIGN.md
                surface: '#0d1832', // Slightly lighter blue for cards
                surfaceHover: '#13234d',
                primary: '#3b82f6', // Bright blue
                primaryHover: '#60a5fa',
                textMain: '#f8fafc',
                textDim: '#cbd5e1',
                textMuted: '#64748b',
                borderSubtle: '#1e293b'
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
