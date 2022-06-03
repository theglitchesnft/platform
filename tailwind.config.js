module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        glitch: {
          teal: '#abdcd0',
          blue: '#9dc4ed',
          cornflower: '#aabbdc',
          avocado: '#c3dcaa',
          purple: '#bbabdc',
          mauve: '#dcabab',
          green: '#b0e8be',
        },
      },
      fontFamily: {
        kaushan: ['Kaushan Script', 'cursive'],
      },
      gridTemplateRows: {
        '[auto,auto,1fr]': 'auto auto 1fr',
      },
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
};
