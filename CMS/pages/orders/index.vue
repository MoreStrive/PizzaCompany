<template>
    <div>
        <!-- <div class="card">
            <div class="flex justify-between items-center" />
        </div> -->
        <div class="card mt-4">
            <PageHeader text="Quản lý đơn hàng" />
            <OrdersTable
                class="mt-4"
                :orders="orders || []"
                :pagination="pagination || {}"
                :loading="loading"
            />
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { mapDataFromOptions } from '@/utils/data';
    import OrdersTable from '@/components/orders/Table.vue';
    import PageHeader from '@/components/shared/PageHeader.vue';

    export default {
        components: {
            OrdersTable,
            PageHeader,
        },

        async fetch() {
            await this.fetchData();
        },

        data() {
            return {
                loading: false,
                images: [],
            };
        },

        computed: {
            ...mapState('orders', ['orders', 'pagination']),
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
                label: 'Quản lý đơn hàng',
                link: '/orders',
            }]);
        },

        methods: {
            mapDataFromOptions,

            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('orders/fetchAll', this.$route.query);
                    await this.$store.dispatch('combos/fetchAll', this.$route.query);
                    await this.$store.dispatch('products/fetchAll', this.$route.query);
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },

        head() {
            return {
                title: 'Quản lý đơn hàng',
            };
        },
    };
</script>
