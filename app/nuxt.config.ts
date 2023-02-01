// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    css: [
        '/node_modules/css.gg/icons/all.css',
        '/node_modules/bpmn-js/dist/assets/diagram-js.css',
        '/node_modules/bpmn-js/dist/assets/bpmn-font/css/bpmn.css',
        '/node_modules/bpmn-js-properties-panel/dist/assets/properties-panel.css',
    ],
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
