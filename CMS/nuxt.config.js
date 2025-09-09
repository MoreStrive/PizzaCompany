require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

export default {
    dev: !isProduction,

    ssr: false,

    // When SPA
    loading: '@/components/shared/Loading.vue',

    // When SSR
    loadingIndicator: {
        name: 'folding-cube',
        color: '#7da640',
    },

    head: {
        title: 'FastFood CMS',
        htmlAttrs: {
            lang: 'en',
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' },
            { name: 'format-detection', content: 'telephone=no' },
            { name: 'title', content: 'Library Manage' },
            { name: 'description', content: '' },
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        ],
    },

    css: [
        '@/assets/main.scss',
        '@/assets/ant/main.less',
        '@fortawesome/fontawesome-free/css/all.css',
    ],

    plugins: [
        '@/plugins/api',
        { src: '@/plugins/axios', mode: 'client' },
        '@/plugins/ant-design',
        '@/plugins/filters',
        '@/plugins/apex-chart',
        '@/plugins/permission',
    ],

    server: {
        host: process.env.HOST || 'localhost',
        port: process.env.PORT || '8088',
    },

    buildModules: [
        '@nuxt/postcss8',
        '@nuxtjs/eslint-module',
        '@nuxtjs/fontawesome',
        '@nuxtjs/tailwindcss',
        '@nuxtjs/google-fonts',
    ],

    googleFonts: {
        families: {
            'Be+Vietnam+Pro': [300, 400, 500, 600],
        },
    },

    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/auth-next',
    ],

    axios: {
        baseURL: process.env.API_HOST || 'http://localhost:8000/api',
    },

    auth: {
        strategies: {
            local: {
                token: {
                    property: 'data.accessToken',
                    global: true,
                    required: true,
                    maxAge: 60 * 60 * 24 * 30,
                    type: 'Bearer',
                },
                autoLogout: false,
                user: {
                    property: 'data.currentActor',
                    autoFetch: true,
                },
                endpoints: {
                    login: {
                        url: '/cms/sessions/login',
                        method: 'POST',
                    },
                    user: {
                        url: '/cms/sessions/get-current-actor',
                        method: 'GET',
                    },
                    logout: false,
                },
                redirect: {
                    login: '/login',
                    logout: '/',
                    callback: '/login',
                    home: '/',
                },
            },
        },
    },

    router: {
        middleware: ['auth'],
    },

    build: {
        postcss: {
            plugins: {
                tailwindcss: 'tailwind.config.js',
                autoprefixer: {},
                ...(process.env.APP_ENV === 'production' ? { cssnano: {} } : {}),
            },
        },
        loaders: {
            less: {
                javascriptEnabled: true,
            },
        },
        babel: {
            plugins: [
                [
                    'import',
                    {
                        libraryName: 'ant-design-vue',
                        libraryDirectory: 'es',
                        style: true,
                    },
                    'ant-design-vue',
                ],
            ],
        },
    },

    env: {
        API_HOST: process.env.API_HOST,
    },
};
