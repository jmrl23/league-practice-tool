/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['index.html', 'dist/renderer.js'],
  theme: {
    extend: {
      fontFamily: {
        'ubuntu-mono': [`'Ubuntu Mono'`, 'monospace']
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
