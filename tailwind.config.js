/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'rgba(var(--border))',
        input: 'rgba(var(--input))',
        ring: 'rgba(var(--ring))',
        background: 'rgba(var(--background))',
        foreground: 'rgba(var(--foreground))',
        primary: {
          DEFAULT: 'rgba(var(--primary))',
          foreground: 'rgba(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'rgba(var(--secondary))',
          foreground: 'rgba(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'rgba(var(--destructive))',
          foreground: 'rgba(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'rgba(var(--muted))',
          foreground: 'rgba(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'rgba(var(--accent))',
          light: 'rgba(var(--accent-light))',
          foreground: 'rgba(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'rgba(var(--popover))',
          foreground: 'rgba(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'rgba(var(--card))',
          foreground: 'rgba(var(--card-foreground))'
        },
        highlight: {
          DEFAULT: 'rgba(var(--highlight))'
        }
      },
      borderRadius: {
        // lg: "var(--radius)",
        md: '0.25rem'
        // sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      },
      fontSize: {
        xxs: '0.625rem',
        xxm: '0.6875rem',
        xsm: '0.8125rem',
        '1xl': '1.375rem'
      },
      width: {
        875: '1.875rem'
      }
    }
  },
  safelist: [
    'prose',
    'prose-slate',
    'dark:prose-invert',
    'prose-headings:font-bold',
    'prose-headings:tracking-tight',
    'prose-h1:text-4xl',
    'prose-h1:font-extrabold',
    'prose-h2:text-3xl',
    'prose-h3:text-2xl',
    'prose-p:text-base',
    'prose-p:leading-7',
  ],
  plugins: [require('@tailwindcss/typography'),require('tailwindcss-animate')]
};
