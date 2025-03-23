export default {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
  corePlugins: {
    preflight: false, // Disables Tailwind's reset
  },
}
