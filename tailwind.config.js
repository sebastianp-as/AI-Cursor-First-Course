/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "hsl(210 20% 98%)",
          dark: "hsl(222 24% 10%)"
        },
        card: {
          DEFAULT: "hsl(0 0% 100% / 0.6)",
          dark: "hsl(222 24% 14% / 0.6)"
        },
        border: {
          DEFAULT: "hsl(0 0% 100% / 0.15)",
          dark: "hsl(0 0% 100% / 0.08)"
        },
        primary: {
          DEFAULT: "#6366f1",
          foreground: "#ffffff"
        }
      },
      backdropBlur: {
        xs: "2px"
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        "glass-strong": "0 20px 60px -20px rgba(0,0,0,0.45)"
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem"
      },
      animation: {
        "fade-in": "fadeIn 600ms ease-out",
        float: "float 6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 4s ease-in-out infinite"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "0.7" }
        }
      }
    }
  },
  plugins: []
};

