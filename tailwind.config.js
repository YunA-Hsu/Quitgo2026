/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 七色情緒系統
        mood: {
          happy: '#FFD166',
          calm: '#7BC8D6',
          ordinary: '#B8C4A4',
          achievement: '#E6B655',
          depressed: '#9C9ABF',
          hurt: '#A3B4C4',
          angry: '#E76F51',
        },
        // 基底色
        base: {
          bg: '#F5F0E6',
          card: '#FDFBF5',
          textPrimary: '#4A4238',
          textSecondary: '#8C8478',
          border: '#E5DECF',
          brandSprout: '#8FA876',
          accentCoral: '#E76F51',
        },
        // 稀有度
        rarity: {
          common: '#C4BBA8',
          rare: '#9FB4C9',
          epic: '#C9A86B',
        },
      },
      fontFamily: {
        sans: ["'Noto Sans TC'", "'PingFang TC'", 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        pill: '999px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(74, 66, 56, 0.06)',
        raised: '0 4px 16px rgba(74, 66, 56, 0.10)',
      },
    },
  },
  plugins: [],
}
