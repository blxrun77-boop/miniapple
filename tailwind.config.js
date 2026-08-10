/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--tg-theme-bg-color, #0f1216)',
        text: 'var(--tg-theme-text-color, #f4f7fb)',
        muted: '#9aa4b2',
        accent: '#22c55e',
        accentBlue: '#1d9bf0',
        card: 'rgba(255,255,255,0.05)',
        border: 'rgba(255,255,255,0.12)'
      },
      boxShadow: {
        glow: '0 0 30px rgba(34, 197, 94, 0.25)'
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
