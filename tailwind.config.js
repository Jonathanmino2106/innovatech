/**
 * INNOVATECH - Tailwind CSS Config
 * Config movida desde el <script> inline de index.html (Tailwind CDN)
 * a build estático con Tailwind CLI. Mismos valores, cero JS en runtime.
 *
 * Build:      npm run css        (genera src/css/tailwind.generated.css)
 * Desarrollo: npm run css:watch  (recompila ante cada cambio de clase)
 */
module.exports = {
  content: ["./index.html", "./src/**/*.js"],
  theme: {
    extend: {
      colors: {
        theme: {
          card: '#0f2742',
          cardDark: '#0a1d33',
          cardAccent: '#163659',
          teal: '#13b8d4',
          tealHover: '#0ea5be',
          buttonDark: '#132840',
          badgeGreen: '#10b981',
          badgeGreenBg: '#ecfdf5',
          grayBg: '#f8fafc',
          borderLight: '#e2e8f0',
          textPrimary: '#0f172a',
          textSecondary: '#64748b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    }
  },
  plugins: []
};
