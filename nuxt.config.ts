// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      title: process.env.APP_TITLE,
      htmlAttrs: {
        lang: process.env.APP_DEFAULT_LANG
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: process.env.APP_DESC
        },
        { name: 'format-detection', content: 'telephone=no' },
        {
          hid: 'og:title',
          property: 'og:title',
          content: process.env.APP_TITLE
        },
        {
          hid: 'og:site_name',
          property: 'og:site_name',
          content: process.env.APP_TITLE
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: process.env.APP_DESC
        },
        { hid: 'og:url', property: 'og:url', content: process.env.APP_URL },
        {
          hid: 'og:locale',
          property: 'og:locale',
          content: process.env.APP_DEFAULT_LANG
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: `${process.env.APP_URL}/og_img.jpeg`
        },
        {
          hid: 'og:image:alt',
          property: 'og:image:alt',
          content: process.env.APP_DESC
        },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: process.env.APP_DESC
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: process.env.APP_TITLE
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: `${process.env.APP_URL}/og_img.jpeg`
        },
        {
          hid: 'robots',
          name: 'robots',
          content: `${
            process.env.WEB_SEARCH === 'YES'
              ? 'index , folow'
              : 'noindex , nofollow'
          } `
        }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],

  // css: ['@/assets/styles/main.scss'],
  vite: {
    server: {
      watch: {
        usePolling: true // set here to enable hot reload
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/main.scss";'
        }
      }
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
