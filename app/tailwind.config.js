const FONT_FAMILY = process.env.NEXT_PUBLIC_FONT_FAMILY || 'Satoshi'
const BODY_FONT_FAMILY = process.env.NEXT_PUBLIC_BODY_FONT_FAMILY || 'Satoshi'

module.exports = {
  content: ["./pages/**/*.{ts,tsx}", ".//config/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./pages/_app.tsx"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        purple: {
          darkpurple: "#0E0333",
          connectPurple: "#6F3FF5",
          gitcoinpurple: "#6f3ff5",
          infoElementBorder: "#D5BDFF",
          infoElementBG: "#F6F0FF",
        },
        yellow: "#FFF8DB",
        blue: {
          darkblue: "#0E0333",
        },
        green: {
          jade: "#02E2AC",
        },
      },
    },
    fontFamily: {
      sans: [`"${BODY_FONT_FAMILY}"`],
      headings: [`"${FONT_FAMILY}"`],
      mono: [`"${BODY_FONT_FAMILY}"`],
    },
    keyframes: {
      'slide-down': {
        '0%': { opacity: 0, transform: 'translateY(-10px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
      },
    },
    animation: {
      'spin-loading': 'spin 1s cubic-bezier(0.76, 0.35, 0.2, 0.7) infinite',
      'slide-down': 'slide-down 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      'spin-reverse': 'spin 1s reverse linear infinite',
    },
    minHeight: {
      default: "100vh",
    },
  },
  plugins: [],
};
