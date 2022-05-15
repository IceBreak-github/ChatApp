module.exports = {
  mode: 'jit',
  future: {
      removeDeprecatedGapUtilities: true,
      purgeLayersByDefault: true,
  },
  purge: {
      enabled: false, //true for production build
      content: [
          '../**/templates/*.html',
          '../**/templates/**/*.html',
          '../**/js/**/*.js'
      ]
  },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: {
        'background': "url('../img/background.png')",
        'background_dark': "url('../img/background_dark.png')",
        'main': "url('../img/main.png')",
        'main_dark': "url('../img/main_dark.png')",
        'footer_phone': "url('../img/footer_phone.png')",
        'header_phone': "url('../img/header_phone.png')",
        'header_tablet': "url('../img/header_tablet.png')",
        'footer_tablet': "url('../img/footer_tablet.png')",
        'logo': "url('../img/Logo.png')",
        'logo_dark': "url('../img/logo_dark.png')",
        'send': "url('../img/send.svg')",
       },
      screens: {
        'sm': '361px',
        'md': '768px',
        'lg': '1366px',
      },
    },
  },
  variants: {},
  plugins: [],
}
