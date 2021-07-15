
// eslint-disable-next-line nuxt/no-cjs-in-config
module.exports = {
  dev: false,
  telemetry: false,
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/style/global.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~plugins/vue-chartjs.js', ssr: false }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxt/typescript-build'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/pwa'
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
  },
  render: {
    // csp: {
    //   reportOnly: true,
    //   hashAlgorithm: 'sha256',
    //   policies: {
    //     'default-src': [ '*' ],
    //     'img-src': [ '*' ],
    //     'worker-src': [ '*' ],
    //     'style-src': [ '*' ],
    //     'script-src': [ '*' ],
    //     'form-action': [ '*' ],
    //     'frame-ancestors': [ '*' ],
    //     'object-src': [ '*' ],
    //     'base-uri': [ '*' ]
    //   }
    // }
    csp: {
      reportOnly: false,
      hashAlgorithm: 'sha256',
      policies: {
        'default-src': [ "'self'" ],
        'img-src': [
          'https:',
          '*.google-analytics.com',
          'cdn.discordapp.com',
          '*.steamstatic.com',
          'cdn.akamai.steamstatic.com',
          'localhost',
          '*.freestuffbot.xyz',
          'data:'
        ],
        'worker-src': [ "'self'", 'blob:' ],
        'style-src': [ "'self'", "'unsafe-inline'" ],
        'connect-src': [ '*' ],
        'script-src': [
          "'self'",
          "'unsafe-inline'",
          'sentry.io',
          'ajax.cloudflare.com',
          'static.cloudflareinsights.com'
        ],
        'form-action': [ "'self'" ],
        'frame-ancestors': [ "'none'" ],
        'object-src': [ "'none'" ],
        'base-uri': []
      }
    }
  }
}
