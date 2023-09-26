module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  purge: [
    './src/**/*.html',
    './src/**/*.tsx',
    './node_modules/@aragon/ods/**/*.cjs.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}