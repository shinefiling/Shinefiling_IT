/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface": "#F6F3EE",
        "primary": "#317CD7",
        "navy": "#0F2E4B",
        "background": "#F6F3EE",
        "on-background": "#0F2E4B",
        "primary-container": "#317CD7",
        "on-primary": "#ffffff",
        "outline": "#0F2E4B",
        "surface-tint": "#317CD7",
        "on-surface": "#0F2E4B",
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "margin-mobile": "16px",
        "margin-desktop": "40px",
        "container-max": "1280px",
        "stack-lg": "32px",
        "gutter": "24px",
        "stack-md": "16px",
        "stack-sm": "8px"
      },
      fontFamily: {
        "display-lg": ["Manrope", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
        "label-md": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "headline-md": ["Manrope", "sans-serif"],
        "headline-lg": ["Manrope", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        serif: ['Instrument Serif', 'serif'],
      },
      fontSize: {
        "display-lg": ["48px", { "lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "body-sm": ["14px", { "lineHeight": "1.5", "fontWeight": "400" }],
        "label-sm": ["12px", { "lineHeight": "1", "letterSpacing": "0.02em", "fontWeight": "500" }],
        "label-md": ["14px", { "lineHeight": "1", "letterSpacing": "0.01em", "fontWeight": "600" }],
        "body-lg": ["18px", { "lineHeight": "1.6", "fontWeight": "400" }],
        "headline-md": ["24px", { "lineHeight": "1.4", "fontWeight": "600" }],
        "headline-lg": ["32px", { "lineHeight": "1.3", "fontWeight": "600" }],
        "body-md": ["16px", { "lineHeight": "1.5", "fontWeight": "400" }]
      }
    },
  },
  plugins: [],
}
