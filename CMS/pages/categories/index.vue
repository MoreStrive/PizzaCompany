<template>
    <div>
        <div class="card">
            <div class="flex justify-between items-center">
                <PageHeader text="Quản lý danh mục" />
                <div class="flex gap-5">
                    <a-button
                        type="primary"
                        class="!bg-prim-100 !border-prim-100"
                        @click="$refs.ProductsCategoriesDialog.open()"
                    >
                        <i class="fas fa-plus mr-2" />
                        Thêm mới
                    </a-button>
                </div>
            </div>
        </div>
        <div class="card mt-4">
            <CategoriesTable
                :categories="categories"
                :loading="loading"
            />
        </div>

        <ProductsCategoriesDialog id="ProductsCategoriesDialog" ref="ProductsCategoriesDialog" />
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { mapDataFromOptions } from '@/utils/data';
    import CategoriesTable from '@/components/products/categories/Table.vue';
    import ProductsCategoriesDialog from '@/components/products/categories/Dialog.vue';
    import PageHeader from '@/components/shared/PageHeader.vue';
    import { TYPE_OPTIONS, TYPE } from '@/constants/categories/type';

    export default {
        components: {
            ProductsCategoriesDialog,
            CategoriesTable,
            PageHeader,
        },

        async fetch() {
            await this.fetchData();
        },
        data() {
            return {
                TYPE,
                TYPE_OPTIONS,
                loading: false,
            };
        },

        computed: {
            ...mapState('categories', ['categories']),
        },

        watch: {
        },

        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Quản lý danh mục',
                link: '/categories',
            }]);
        },

        methods: {
            mapDataFromOptions,

            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('categories/fetchAll');
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },

        head() {
            return {
                title: 'Quản lý danh mục',
            };
        },
    };
</script>
