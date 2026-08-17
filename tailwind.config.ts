import type { Config } from 'tailwindcss'

// Design system "Shopee Orange" — dùng chung cho toàn app
export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        // Màu thương hiệu Shopee (cam)
        brand: {
          50: '#fff3ef',
          100: '#ffe4da',
          200: '#ffc7b3',
          300: '#ffa183',
          400: '#fa7350',
          500: '#ee4d2d', // Shopee primary
          600: '#d73211',
          700: '#b3270d',
          800: '#8f2210',
          900: '#752012',
          950: '#400d05',
        },
        // Nền tối cho header/footer
        ink: {
          900: '#1d1210',
          950: '#140b09',
        },
        // Nền app
        mist: '#faf6f4',
      },
      boxShadow: {
        // Shadow mềm nhiều lớp cho card
        soft: '0 1px 2px rgba(16,24,40,.05), 0 8px 24px -8px rgba(16,24,40,.10)',
        // Glow màu brand cho nút primary
        glow: '0 8px 20px -6px rgba(238,77,45,.45)',
      },
      borderRadius: {
        '2.5xl': '1.25rem',
      },
      animation: {
        'fade-in': 'fade-in .2s ease-out',
        'pop-in': 'pop-in .25s cubic-bezier(.34,1.56,.64,1)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'pop-in': {
          from: { opacity: '0', transform: 'scale(.96) translateY(8px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
    },
  },
}
