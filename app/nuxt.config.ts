// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    css: ['/node_modules/css.gg/icons/all.css'],
    modules: [
        '@nuxtjs/tailwindcss',
        '@vueuse/nuxt',
    ],
    runtimeConfig: {
        public: {
            API_URL: 'Missing .env config file!'
        }
    }
})
