<template>
    <div>
        <div class="card space-y-4">
            <div class="flex items-center justify-between">
                <PageHeader text="Quản lý sản phẩm" />
                <a-button type="primary" :loading="loading" @click="$refs.ProductForm.submit()">
                    Thêm sản phẩm
                </a-button>
            </div>
        </div>

        <div class="card space-y-4 mt-4">
            <ProductForm ref="ProductForm" :loading="loading" @submit="createProduct" />
        </div>
    </div>
</template>

<script>
    import PageHeader from '@/components/shared/PageHeader.vue';
    import ProductForm from '@/components/products/Form.vue';
    import { convertToFormData } from '@/utils/form';

    export default {
        components: {
            PageHeader,
            ProductForm,
        },

        data() {
            return {
                loading: false,
            };
        },

        computed: {
        },

        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Sản phẩm',
                link: '/products',
            }, {
                label: 'Thêm sản phẩm',
                link: '/products/create',
            }]);
        },

        methods: {
            async createProduct(payload, fileThumbnail) {
                try {
                    this.loading = true;
                    const _payload = payload;
                    if (fileThumbnail) {
                        const { data: { fileAttributes } } = await this.$api.uploaders.uploadFiles(convertToFormData({
                            files: fileThumbnail,
                        }));
                        _payload.thumbnail = fileAttributes[0]?.source;
                    }
                    await this.$api.products.create(_payload);
                    this.$message.success('Thêm sản phẩm thành công');
                    this.$router.push('/products');
                } catch (e) {
                    this.$handleError(e);
                } finally {
                    this.loading = false;
                }
            },
        },

        head() {
            return {
                title: 'Thêm sản phẩm mới',
            };
        },
    };
</script>
