<template>
    <div>
        <div class="card">
            <div class="flex justify-between items-center">
                <ct-page-header show-back text="Tạo đơn hàng mới" />
                <div class="flex gap-x-5">
                    <nuxt-link to="/orders">
                        <a-button type="default">
                            Quay lại
                        </a-button>
                    </nuxt-link>
                    <!-- <a-button
                        type="primary"
                        :loading="loading"
                        @click="$refs.OrdersForm.submit()"
                    >
                        Thêm mới
                    </a-button> -->
                </div>
            </div>
        </div>
        <div class="card mt-4">
            <OrdersForm
                ref="OrdersForm"
                @submit="submitForm"
            />
        </div>
    </div>
</template>

<script>
    import OrdersForm from '@/components/orders/Form.vue';

    export default {
        components: {
            OrdersForm,
        },

        async asyncData({ store }) {
            await store.dispatch('products/fetchAllVariant');
        },

        data() {
            return {
                loading: false,
            };
        },

        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Đơn hàng',
                link: '/products',
            }, {
                label: 'Thêm mới đơn hàng',
                link: '/products/create',
            }]);
        },

        methods: {
            async submitForm(payload) {
                try {
                    this.loading = true;
                    await this.$api.orders.create(payload);
                    this.$message.success('Tạo đơn hàng mới thành công');
                    this.$router.push('/orders');
                    this.$nuxt.refresh();
                } catch (e) {
                    this.$handleError(e);
                } finally {
                    this.loading = false;
                }
            },
        },

        head() {
            return {
                title: 'Thêm mới đơn hàng',
            };
        },
    };
</script>
