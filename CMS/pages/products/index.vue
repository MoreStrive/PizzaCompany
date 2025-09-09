<template>
    <div>
        <div class="card">
            <ProductFilters />
        </div>

        <div class="card space-y-4 mt-4">
            <div class="flex items-center justify-between mb-4">
                <PageHeader text="Quản lý sản phẩm" />
                <nuxt-link v-if="$permission.Admin()" to="/products/create">
                    <a-button type="primary">
                        Thêm sản phẩm
                    </a-button>
                </nuxt-link>
            </div>
            <ProductTable :products="products" :pagination="pagination" :loading="loading" />
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import PageHeader from '@/components/shared/PageHeader.vue';
    import ProductTable from '@/components/products/Table.vue';
    import ProductFilters from '@/components/products/Filters.vue';

    export default {
        components: {
            PageHeader,
            ProductTable,
            ProductFilters,
        },

        async fetch() {
            await this.fetchData();
        },

        data() {
            return {
                loading: false,
            };
        },

        computed: {
            ...mapState('products', ['products', 'pagination']),
        },

        watch: {
            '$route.query': {
                async handler() {
                    await this.fetchData();
                },
            },
            deep: true,
        },

        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Sản phẩm',
                link: '/',
            }]);
        },

        methods: {
            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('products/fetchAll', this.$route.query);
                } catch (e) {
                    this.$handleError(e);
                } finally {
                    this.loading = false;
                }
            },
        },

        head() {
            return {
                title: 'Quản lý sản phẩm',
            };
        },
    };
</script>
