/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#64748B',
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        background: '#FFFFFF',
        foreground: '#0F172A',
        card: '#F8FAFC',
        'card-foreground': '#0F172A',
        muted: '#F1F5F9',
        'muted-foreground': '#64748B',
        accent: '#F1F5F9',
        'accent-foreground': '#0F172A',
        border: '#E2E8F0',
        input: '#E2E8F0',
        ring: '#3B82F6',
      },
    },
  },
  plugins: [],
}
