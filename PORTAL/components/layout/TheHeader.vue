<template>
    <header class="flex flex-col items-center justify-center absolute w-full z-50">
        <div class="container py-2.5 w-full flex items-center justify-between">
            <div class="flex items-center">
                <div>
                    <nuxt-link class="flex items-center gap-2" to="/">
                        <span v-if="$route.fullPath.includes('/combo') || $route.fullPath.includes('/san-pham') || $route.fullPath.includes('/gio-hang') || $route.fullPath.includes('/thanh-toan')">
                            <img src="/images/logo-dark.png" class="max-w-[200px]" alt="FASTHAMB">
                        </span>
                        <span v-else>
                            <img src="/images/logo.png" class="max-w-[200px]" alt="FASTHAMB">
                        </span>
                    </nuxt-link>
                </div>
                <div class="hidden xl:block ml-[100px]">
                    <div class="nav">
                        <ul class="flex gap-8 items-center mb-0">
                            <li v-for="item, index in menuItems" :key="index" :class="[item.childrens && item.childrens.length > 0 ? 'flex relative group items-center gap-2' : '']">
                                <template v-if="item.childrens && item.childrens.length > 0">
                                    <nuxt-link :to="item.key" class="text-lg font-bold !text-title hover:!text-primary-100 transition-all duration-300">
                                        {{ item.label }}
                                    </nuxt-link>
                                    <span class="icon w-2.5 h-2.5 relative overflow-hidden text-primary-100 cursor-pointer" />
                                    <ul class="absolute flex flex-col gap-2 bg-background-pastel py-2.5 px-4 w-max top-10 transform opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                                        <li v-for="_item, _index in item.childrens" :key="_index" class="">
                                            <nuxt-link :to="_item.key" class="text-lg font-semibold !text-title hover:!text-primary-100 transition-all duration-300">
                                                {{ _item.label }}
                                            </nuxt-link>
                                        </li>
                                    </ul>
                                </template>
                                <template v-else>
                                    <nuxt-link
                                        :to="item.key"
                                        class="text-xl font-light transition-all duration-300"
                                        :class="[$route.fullPath.includes('/combo') || $route.fullPath.includes('/san-pham') || $route.fullPath.includes('/gio-hang') || $route.fullPath.includes('/thanh-toan') ? '!text-white hover:!text-primary-100' : 'hover:!text-primary-100', `/${$route.fullPath.split('/').pop()}` === (item.key) ? 'underline' : '']"
                                    >
                                        {{ item.label }}
                                    </nuxt-link>
                                </template>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-5">
                <div class="flex items-center gap-5">
                    <template v-if="currentUser">
                        <a-popover :trigger="['click']">
                            <template slot="content">
                                <a-menu slot="overlay" class="!border-none">
                                    <a-menu-item>
                                        <nuxt-link to="/trang-ca-nhan">
                                            Xem trang cá nhân
                                        </nuxt-link>
                                    </a-menu-item>
                                    <a-menu-item @click="logout">
                                        Đăng xuất
                                    </a-menu-item>
                                </a-menu>
                            </template>
                            <button class="relative">
                                <div class="w-[50px] h-[50px] overflow-hidden rounded-full shadow-lg cursor-pointer">
                                    <img :src="currentUser.avatar || '/images/default-avatar.png'" class="w-full h-full rounded-full object-cover" alt="avatar">
                                </div>
                            </button>
                        </a-popover>
                    </template>
                    <template v-else>
                        <nuxt-link to="/dang-nhap">
                            <div class="py-2 px-6 font-medium no-underline flex justify-center items-center shadow-lg cursor-pointer transition-all duration-300 m-1 rounded-sm text-primary-100 bg-[#f7f7f7] hover:bg-secondary-100 hover:text-white">
                                Đăng nhập
                            </div>
                        </nuxt-link>
                    </template>

                    <a-popover :trigger="['click']" placement="bottomLeft">
                        <template slot="content">
                            <Cart :cart="useCart.cart" :dashboard="null" />
                        </template>
                        <button class="relative">
                            <div class="social-icon text-primary-100 bg-[#f7f7f7] hover:bg-secondary-100 hover:text-white">
                                <i class="fas fa-shopping-cart" />
                            </div>
                        </button>
                    </a-popover>
                </div>
                <div
                    class="xl:hidden block cursor-pointer"
                >
                    <!-- @click="showMenu" -->
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="50"
                        height="50"
                        viewBox="0 0 24 24"
                        fill="none"
                        style="transform: rotate(0deg)"
                    >
                        <path
                            d="M3 7h18M3 12h18M3 17h18"
                            stroke="#534931"
                            stroke-width="1.5"
                            stroke-linecap="round"
                        />
                    </svg>
                </div>
            </div>
        </div>

        <!-- <a-drawer
            title=""
            placement="top"
            height="300px"
            :closable="false"
            :visible="isShowMenu"
            @close="hideMenu"
        >
            <div class="grid grid-cols-2 items-center gap-5 py-10">
                <ul class="flex flex-col justify-start md:flex-row gap-3 items-center mb-0">
                    <li v-for="item, index in menuItems" :key="index" :class="[item.childrens && item.childrens.length > 0 ? 'flex relative group items-center gap-2' : 'w-full']">
                        <template v-if="item.childrens && item.childrens.length > 0">
                            <span class="text-lg font-bold !text-title hover:!text-primary-100 transition-all duration-300">{{ item.label }}</span>
                            <span class="icon w-2.5 h-2.5 relative overflow-hidden text-primary-100 cursor-pointer" />
                            <ul class="absolute flex flex-col gap-2 bg-background-pastel py-2.5 px-4 w-max top-10 transform opacity-0 group-:opacity-100 transition-all duration-300 shadow-lg">
                                <li v-for="_item, _index in item.childrens" :key="_index" class="">
                                    <nuxt-link :to="_item.key" class="text-lg font-semibold !text-title hover:!text-primary-100 transition-all duration-300">
                                        {{ _item.label }}
                                    </nuxt-link>
                                </li>
                            </ul>
                        </template>
                        <template v-else>
                            <nuxt-link :to="item.key" class="text-lg font-bold !text-title hover:!text-primary-100 transition-all duration-300">
                                {{ item.label }}
                            </nuxt-link>
                        </template>
                    </li>
                </ul>
                <nuxt-link class="flex items-center gap-2 flex-wrap justify-end" to="/">
                    <span><img src="/images/logo.png" alt="The Coffee Vicode"></span>
                </nuxt-link>
            </div>
        </a-drawer> -->
    </header>
</template>

<script>
    import { mapGetters } from 'vuex';
    import Cart from '@/components/layout/DropdownCard.vue';

    export default {
        components: {
            Cart,
        },

        data() {
            return {
                isShowMenu: false,
            };
        },

        computed: {
            ...mapGetters('products', ['useCart']),
            currentUser() {
                return this.$auth.user || null;
            },
            menuItems() {
                return [
                    {
                        label: 'Trang chủ',
                        key: '/',
                        childrens: [],
                    },
                    {
                        label: 'Sản phẩm',
                        key: '/san-pham',
                        childrens: [],
                    },
                    {
                        label: 'Liên hệ',
                        key: '/lien-he',
                        childrens: [],
                    },
                ];
            },
        },

        methods: {
            async logout() {
                await this.$auth.logout();
            },
        },
    };
</script>

<style lang="scss" scoped>
    .icon::before {
        @apply h-0.5 w-full content-[''] absolute -translate-y-1/2 top-1/2 bg-primary-100;
    }
    .icon::after {
        @apply content-[''] absolute h-full w-0.5 -translate-x-1/2 transition-all duration-300 ease-in-out left-1/2 top-0 bg-primary-100;
    }
</style>

<style lang="scss">
    .social-icon {
        @apply w-[50px] h-[50px] text-xl font-medium no-underline flex justify-center items-center shadow-lg cursor-pointer transition-all duration-300 m-1 rounded-full;
    }
</style>
