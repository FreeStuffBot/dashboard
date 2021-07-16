
// eslint-disable-next-line nuxt/no-cjs-in-config
module.exports = {
  mode: 'universal',
  target: 'static',
  telemetry: false,
  head: {
    title: 'FreeStuff Dashboard',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
    ]
  },
  loading: { color: '#fff' },
  css: [
  ],
  plugins: [
    { src: '~plugins/vue-chartjs.js', ssr: false }
  ],
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/svg',
    '@nuxtjs/style-resources'
  ],
  modules: [
    '@nuxtjs/pwa',
    'nuxt-i18n'
  ],
  styleResources: {
    scss: [
      '@/assets/style/all.scss'
    ]
  },
  build: {
  },
  // render: {
  //   csp: {
  //     reportOnly: false,
  //     hashAlgorithm: 'sha256',
  //     policies: {
  //       'default-src': [ "'self'" ],
  //       'img-src': [
  //         'https:',
  //         '*.google-analytics.com',
  //         'cdn.discordapp.com',
  //         '*.steamstatic.com',
  //         'cdn.akamai.steamstatic.com',
  //         'localhost:*',
  //         '*.freestuffbot.xyz',
  //         'data:'
  //       ],
  //       'worker-src': [ "'self'", 'blob:' ],
  //       'style-src': [ "'self'", "'unsafe-inline'" ],
  //       'connect-src': [ '*' ],
  //       'script-src': [
  //         '*',
  //         'localhost:*',
  //         '*.freestuffbot.xyz',
  //         'data:',
  //         "'self'",
  //         "'unsafe-inline'",
  //         "'unsafe-eval'",
  //         'sentry.io',
  //         'ajax.cloudflare.com',
  //         'static.cloudflareinsights.com'
  //       ],
  //       'form-action': [ "'self'" ],
  //       'frame-ancestors': [ "'none'" ],
  //       'object-src': [ "'none'" ],
  //       'base-uri': []
  //     }
  //   }
  // },
  generate: {
    exclude: [
      /^\/o\//
    ]
  },
  i18n: {
    locales: [ 'en' ],
    defaultLocale: 'en',
    vueI18n: {
      fallbackLocale: 'en',
      messages: {
        en: {
          continue: 'Continue',
          skip: 'Skip',
          new: 'New',
          back: 'Back',
          create: 'Create',
          add: 'Add',

          error_user_invalid: 'Invalid user'
        }
      }
    }
  }
}
