// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({

  
  buildModules: [
    '@nuxtjs/moment'
  ],
  modules: [
    '@nuxtjs/eslint-module',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt',
    'nuxt-lodash',
    'nuxt-primevue'
  ],
  primevue: {

  },
  eslint: {
  },
  devtools: { enabled: true },
  css: [
    '~/assets/scss/base.scss'
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  app: {
    head: {
      title: 'ISAC',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width,initial-scale=1' },
      ],
      bodyAttrs: {
        class: 'h-full'
      },
      htmlAttrs: {
        class: 'text-xs'
      }
    },
  },
  imports: {
    dirs: ['./stores/**']
  },
  pinia: {

  },
  components: {
    dirs: [
      {
        path: "~/components/common/elements",
        global: true,
        pathPrefix: false
      },
      {
        path: "~/components/common",
        global: true
      },
      {
        path: '~/components/pages',
        global: true,
        pathPrefix: false
      },
      '~/components'
    ]
  },
  dir: {
    pages: 'views'
  },
  runtimeConfig: {
    public: {
      apiKey: process.env.API_KEY,
      apiBaseUrl: process.env.API_BASE_URL,
      aesKey: process.env.AES_KEY,
      aesIv: process.env.AES_IV      
    },
    server: {
      bodyParser: {
        sizeLimit: '100mb'
      }
    }
  },
  server: {
    host: '0.0.0.0', // 모든 IP 주소에서 접근 가능
    port: 443      // 원하는 포트 번호
  },
  routeRules: {
    '/api/**' : {
      proxy: `${process.env.API_BASE_URL}/**`
    },
    'https://ui-avatars.com/api/**': {
      cache: {
        maxAge: 60 * 60 * 24 * 7
      }
    }
  },
  nitro: {
    externals: {
      external: ['xlsx'], // <- 이 줄이 핵심!
    }
  }
})
