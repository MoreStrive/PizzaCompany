<template>
    <div>
        <div class="card space-y-4">
            <div class="flex items-center justify-between">
                <div class="flex gap-2 items-center">
                    <PageHeader text="Quản lý sản phẩm" />
                    <a-tag :color="STATUS_COLOR[product.status]">
                        {{ STATUS_LABEL[product.status] }}
                    </a-tag>
                </div>
                <div class="flex gap-2 items-center">
                    <a-button :loading="loading" @click="$refs.ConfirmStatusDialog.open()">
                        Thay đổi trạng thái
                    </a-button>
                    <a-button type="primary" :loading="loading" @click="$refs.ProductForm.submit()">
                        Cập nhật
                    </a-button>
                </div>
            </div>
        </div>

        <div class="card space-y-4 mt-4">
            <ProductForm
                ref="ProductForm"
                :product="product"
                :loading="loading"
                @submit="updateProduct"
            />
        </div>

        <div class="space-y-4 mt-4">
            <ProductComment
                ref="ProductComment"
                :comments="comments"
                :pagination="pagination"
            />
        </div>

        <ConfirmDialog
            ref="ConfirmStatusDialog"
            title="Thay đổi trạng thái"
            @confirm="changeStatus"
        >
            <div class="text-center">
                <p class="text-lg">
                    Bạn chắc chắn thay đổi này chứ?
                </p>
                <span class="block"><span class="font-semibold">Lưu ý</span>: Các thành phần phụ thuộc sẽ thay đổi để phù hợp</span>
            </div>
        </ConfirmDialog>
    </div>
</template>

<script>
    import { STATUS_OPTIONS } from '@/constants/status';
    import { mapState } from 'vuex';
    import PageHeader from '@/components/shared/PageHeader.vue';
    import ProductForm from '@/components/products/Form.vue';
    import ProductComment from '@/components/shared/ProductComment.vue';
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
    import { convertToFormData } from '@/utils/form';
    import { mapDataFromOptions } from '@/utils/data';

    export default {
        components: {
            PageHeader,
            ProductForm,
            ProductComment,
            ConfirmDialog,
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
            ...mapState('products', ['product']),
            ...mapState('comments', ['comments', 'ratingAVG', 'pagination']),
            STATUS_LABEL() {
                return this.mapDataFromOptions(STATUS_OPTIONS, 'value', 'label');
            },
            STATUS_COLOR() {
                return this.mapDataFromOptions(STATUS_OPTIONS, 'value', 'color');
            },
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
                link: '/products',
            }, {
                label: 'Cập nhật sản phẩm',
                link: `/products/${this.product.id}/update`,
            }]);
        },

        methods: {
            mapDataFromOptions,

            async fetchData() {
                try {
                    await this.$store.dispatch('products/fetchDetail', this.$route.params.id);
                    await this.$store.dispatch('comments/fetchAll', { id: this.$route.params.id, params: this.$route.query });
                    this.loading = true;
                } catch (e) {
                    this.$handleError(e);
                } finally {
                    this.loading = false;
                }
            },

            async changeStatus() {
                await this.$api.products.changeStatus(this.$route.params.id, {
                    status: this.product.status === 'active' ? 'inactive' : 'active',
                });
                this.$message.success('Cập nhật thông tin sản phẩm thành công');
                this.$nuxt.refresh();
            },

            async updateProduct(payload, fileThumbnail) {
                try {
                    this.loading = true;
                    const _payload = payload;
                    if (fileThumbnail) {
                        const { data: { fileAttributes } } = await this.$api.uploaders.uploadFiles(convertToFormData({
                            files: fileThumbnail,
                        }));
                        _payload.thumbnail = fileAttributes[0]?.source;
                    }
                    await this.$api.products.update(this.$route.params.id, _payload);
                    this.$message.success('Cập nhật thông tin sản phẩm thành công');
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
                title: 'Cập nhật sản phẩm',
            };
        },
    };
</script>
