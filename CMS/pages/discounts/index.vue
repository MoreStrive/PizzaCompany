<template>
    <div>
        <div class="card">
            <div class="flex justify-between items-center">
                <PageHeader text="Danh sách mã giảm giá" />
                <button @click="$refs.discountDialog.open()">
                    <a-button type="primary">
                        <i class="fas fa-plus mr-2" />
                        Thêm mới
                    </a-button>
                </button>
            </div>
            <DiscountTable
                class="mt-4"
                :discounts="discounts"
                :loading="loading"
            />
            <DiscountDialog ref="discountDialog" />
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import DiscountTable from '@/components/discounts/Table.vue';
    import DiscountDialog from '@/components/discounts/Dialog.vue';
    import PageHeader from '@/components/shared/PageHeader.vue';

    export default {
        components: {
            DiscountTable,
            DiscountDialog,
            PageHeader,
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
            ...mapState('discounts', ['discounts']),
        },
        watch: {
            '$route.query': {
                handler() {
                    this.fetchData();
                },
            },
        },
        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Danh sách mã giảm giá',
                link: '/discounts',
            }]);
        },

        methods: {

            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('discounts/fetchAll');
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },

        head() {
            return {
                title: 'Danh sách mã giảm giá',
            };
        },
    };
</script>
