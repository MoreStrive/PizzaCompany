<template>
    <div class="!w-[270px] h-screen bg-white flex flex-col p-3">
        <div class="flex justify-center items-center py-3">
            <nuxt-link class="flex items-center gap-2" to="/">
                <span v-if="$route.fullPath.includes('/san-pham')">
                    <img src="/images/logo-dark.png" class="max-w-[200px]" alt="FASTHAMB">
                </span>
                <span v-else>
                    <img src="/images/logo.png" class="max-w-[200px]" alt="FASTHAMB">
                </span>
            </nuxt-link>
        </div>
        <a-menu
            :open-keys="openKeys"
            :default-selected-keys="activeKeys"
            :inline-collapsed="collapsed"
            class="!mt-6 w-full flex-grow overflow-y-auto custom-scroll overflow-x-hidden !p-1"
            mode="inline"
            @click="handleClick"
            @openChange="handleOpenChange"
        >
            <template v-for="sidebarItem in sidebar">
                <template v-if="authUser && sidebarItem.permissions && sidebarItem.permissions.includes(authUser.role)">
                    <a-sub-menu v-if="sidebarItem.childs" :key="sidebarItem.route">
                        <template slot="title">
                            <i :class="sidebarItem.icon" class="!text-2xl mr-2" />
                            <span class="truncate">{{ sidebarItem.label }}</span>
                        </template>
                        <template v-if="authUser && sidebarItem.permissions && sidebarItem.permissions.includes(authUser.role)">
                            <template v-for="sidebarItemChild in sidebarItem.childs">
                                <a-menu-item v-if="sidebarItemChild.route" :key="sidebarItemChild.route" class="!ml-5">
                                    <span class="truncate">{{ sidebarItemChild.label }}</span>
                                </a-menu-item>
                            </template>
                        </template>
                    </a-sub-menu>
                    <a-menu-item v-else :key="sidebarItem.route">
                        <i :class="sidebarItem.icon" class="!text-2xl mr-2" />
                        <span class="truncate">{{ sidebarItem.label }}</span>
                    </a-menu-item>
                </template>
            </template>
        </a-menu>

        <div class="border-t border-gray-40 pt-3">
            <div class="flex items-center gap-3">
                <div class="border border-gray-20 rounded-md overflow-hidden">
                    <img
                        :src="authUser.avatar || '/images/default-avatar.jpg'"
                        onerror="this.src='/images/default-avatar.jpg'"
                        class="w-12 aspect-square object-cover"
                    >
                </div>
                <div>
                    <div class="font-medium text-gray-100 hover:underline">
                        <nuxt-link :to="`/staffs-manage/${authUser.id}/update`">
                            {{ authUser.full_name || '' }}
                        </nuxt-link>
                    </div>
                    <span>
                        Role: {{ $permission.Admin() ? 'ADMIN' : $permission.Manage() ? 'Quản lý' : 'Nhân viên' }}
                    </span>
                </div>
            </div>
            <a-button
                type="primary"
                class="mt-3 w-full"
                size="small"
                @click="logout"
            >
                <i class="fa-solid fa-right-from-bracket" />
                Đăng xuất
            </a-button>
        </div>
    </div>
</template>

<script>
    export default {
        components: {
        },

        async fetch() {
            await this.fetchData();
        },

        data() {
            return {
                isOpen: true,
                openKeys: [],
                logoutVisible: false,
                collapsed: false,
                visible: false,
                localStorage: '',
                sidebar: [{
                    route: '/',
                    label: 'Tổng quan',
                    icon: 'isax isax-shop',
                    permissions: ['ADMIN', 'MANAGE'],
                }, {
                    route: '/products',
                    label: 'Quản lý sản phẩm',
                    icon: 'isax isax-gallery',
                    permissions: ['ADMIN', 'MANAGE', 'STAFF'],
                    childs: [
                        {
                            route: '/products',
                            label: 'Danh sách sản phẩm',
                            icon: 'isax isax-note',
                            permissions: ['ADMIN', 'MANAGE', 'STAFF'],
                        },
                        {
                            route: '/combos',
                            label: 'Danh sách Combo',
                            icon: 'isax isax-note',
                            permissions: ['ADMIN', 'MANAGE', 'STAFF'],
                        },
                        {
                            route: '/categories',
                            label: 'Danh sách danh mục',
                            icon: 'isax isax-note',
                            permissions: ['ADMIN', 'MANAGE'],
                        },
                    ],
                }, {
                    route: '/staffs-manage',
                    label: 'Quản lý nhân viên',
                    icon: 'isax isax-profile-2user',
                    permissions: ['ADMIN', 'MANAGE'],
                }, {
                    route: '/users-manage',
                    label: 'Quản lý người dùng',
                    icon: 'isax isax-profile-2user',
                    permissions: ['ADMIN', 'MANAGE', 'STAFF'],
                }, {
                    route: '/orders',
                    label: 'Quản lý đơn hàng',
                    icon: 'isax isax-note',
                    permissions: ['ADMIN', 'MANAGE', 'STAFF'],
                }, {
                    route: '/materials',
                    label: 'Quản lý nguyên liệu',
                    icon: 'isax isax-box',
                    permissions: ['ADMIN', 'MANAGE', 'STAFF'],
                }, {
                    route: '/discounts',
                    label: 'Quản lý giảm giá',
                    icon: 'isax isax-shopping-cart',
                    permissions: ['ADMIN', 'MANAGE'],
                }, {
                    route: '/contacts',
                    label: 'Danh sách yêu cầu',
                    icon: 'isax isax-send-2',
                    permissions: ['ADMIN', 'MANAGE', 'STAFF'],
                }, {
                    route: '/settings',
                    label: 'Cài đặt',
                    icon: 'isax isax-setting-2',
                    permissions: ['ADMIN'],
                }],
            };
        },

        computed: {
            activeKeys() {
                return [this.$route.path];
            },

            authUser() {
                return this.$auth.user || {};
            },
        },

        async mounted() {
            this.collapsed = localStorage.getItem('collapsed') || false;
        },

        methods: {
            async fetchData() {
                try {
                    this.loading = true;
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },

            handleClick({ key }) {
                this.$router.push(key);
            },

            handleOpenChange(keys) {
                this.openKeys = keys?.length ? [keys?.pop()] : [];
            },

            toggleCollapsed() {
                this.collapsed = !this.collapsed;
                localStorage.setItem('collapsed', this.collapsed);
            },

            handleHoverChange(visible) {
                this.visible = visible;
            },

            async logout() {
                await this.$auth.logout();
                window.location.replace('/login');
            },
        },
    };
</script>
