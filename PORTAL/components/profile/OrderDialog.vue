<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        title="Chi tiết đơn hàng"
        :footer="false"
        width="1400px"
    >
        <template v-if="order">
            <OrderForm :order-id="order.id" />
        </template>
    </a-modal>
</template>

<script>
    import OrderForm from '@/components/profile/OrderForm.vue';

    export default {
        components: {
            OrderForm,
        },

        data() {
            return {
                error: null,
                visible: false,
                loading: false,
                order: null,
            };
        },

        methods: {
            open(order) {
                this.visible = true;
                this.order = order;
            },

            close() {
                this.visible = false;
            },
        },
    };
</script>
