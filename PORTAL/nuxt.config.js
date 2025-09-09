require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

export default {
    dev: !isProduction,
    ssr: false,

    // When SPA
    loading: '@/components/shared/Loading.vue',

    // When SSR
    loadingIndicator: {
        name: 'cube-grid',
        color: '#7da640',
    },

    head: {
        title: 'Fast Food',
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
        '@/plugins/filters',
        { src: '@/plugins/axios', mode: 'client' },
        '@/plugins/ant-design',
    ],

    server: {
        host: process.env.HOST || 'localhost',
        port: process.env.PORT || '8080',
    },

    buildModules: [
        '@nuxt/postcss8',
        '@nuxtjs/eslint-module',
        '@nuxtjs/fontawesome',
        '@nuxtjs/tailwindcss',
    ],

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
                    property: 'data.user',
                    autoFetch: true,
                },
                endpoints: {
                    login: {
                        url: `${process.env.API_HOST}/client/sessions/login`,
                        method: 'POST',
                    },
                    user: {
                        url: `${process.env.API_HOST}/client/sessions/get-current-user`,
                        method: 'GET',
                    },
                    logout: false,
                },
                redirect: {
                    login: '/dang-nhap',
                    logout: '/',
                    callback: '/dang-nhap',
                    home: '/',
                },
            },
        },
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
        API_HOST: process.env.API_HOST || 'localhost',
        RSA_PUBLIC_KEY: process.env.RSA_PUBLIC_KEY,
    },
};
