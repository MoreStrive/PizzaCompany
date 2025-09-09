<template>
    <div class="mt-20">
        <a-form-model
            ref="form"
            :model="form"
            :rules="rules"
            layout="vertical"
            :colon="false"
        >
            <div class="grid grid-cols-2 gap-10">
                <div>
                    <a-form-model-item label="Nội dung:" prop="content">
                        <a-textarea v-model="form.content" placeholder="Nhập nội dung" :auto-size="{ minRows: 5, maxRows: 5 }" />
                    </a-form-model-item>
                    <div class="flex items-center justify-between">
                        <div>
                            <span class="mr-2">Đánh giá: </span><a-rate v-model="form.rating" />
                        </div>
                        <div>
                            <a-button
                                class="!w-[160px] !h-[50px] !rounded-full"
                                type="primary"
                                :loading="loading"
                                @click="submit"
                            >
                                Gửi đánh giá
                            </a-button>
                        </div>
                    </div>
                </div>
                <div class="hidden xl:block">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
                        <div class="flex flex-col p-5 rounded-xl bg-[#fef2f2]">
                            <div><i class="text-3xl isax isax-truck-time" /></div>
                            <div class="mt-2.5">
                                <p class="font-semibold text-lg mb-0 text-slate-900">
                                    Vận chuyển siêu tốc
                                </p>
                                <p class="text-slate-500 mt-0.5 text-sm">
                                    Để đồ ăn đến tay bạn luôn ở trạng thái tốt nhất
                                </p>
                            </div>
                        </div>
                        <div class="flex flex-col p-5 rounded-xl bg-[#f0f9ff]">
                            <div><i class="text-3xl isax isax-convert-3d-cube" /></div>
                            <div class="mt-2.5">
                                <p class="font-semibold text-lg mb-0 text-slate-900">
                                    Phản hồi nhanh chóng
                                </p>
                                <p class="text-slate-500 mt-0.5 text-sm">
                                    Mọi thắc mắc và phản hồi về sản phẩm và nhân viên đuộc cập nhật liên tục
                                </p>
                            </div>
                        </div>
                        <div class="flex flex-col p-5 rounded-xl bg-[#f0fdf4]">
                            <div><i class="text-3xl isax isax-devices" /></div>
                            <div class="mt-2.5">
                                <p class="font-semibold text-lg mb-0 text-slate-900">
                                    Giao diện Bắt Mắt
                                </p>
                                <p class="text-slate-500 mt-0.5 text-sm">
                                    FastFood giao diện bắt mắt kích thích dễ sử dụng
                                </p>
                            </div>
                        </div>
                        <div class="flex flex-col p-5 rounded-xl bg-[#fffbeb]">
                            <div><i class="text-3xl isax isax-data-2" /></div>
                            <div class="mt-2.5">
                                <p class="font-semibold text-lg mb-0 text-slate-900">
                                    Kết nối đa thiết bị
                                </p>
                                <p class="text-slate-500 mt-0.5 text-sm">
                                    Fastfood được cập nhật liên tục để phù hợp với nhiều người dùng và thiết bị
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </a-form-model>

        <div id="reviews" class="mt-20">
            <div v-if="comments && comments.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-y-11 gap-x-28">
                <ProductComment v-for="(comment, index) in viewMore ? comments : comments.slice(0, 6)" :key="index" :comment="comment" />
            </div>
            <div v-if="comments && comments.length > 5" class="mt-10">
                <a-button
                    v-if="viewMore"
                    class="!w-[160px] !h-[50px] !rounded-full"
                    type="primary"
                    :loading="loading"
                    @click="viewMore = false"
                >
                    Đóng lại
                </a-button>
                <a-button
                    v-if="!viewMore"
                    class="!w-[160px] !h-[50px] !rounded-full"
                    type="primary"
                    :loading="loading"
                    @click="viewMore = true"
                >
                    Xem toàn bộ
                </a-button>
            </div>
        </div>
        <RequestLoginDialog ref="RequestLoginDialog" />
    </div>
</template>

<script>
    import _assign from 'lodash/assign';
    import _cloneDeep from 'lodash/cloneDeep';
    import ProductComment from '@/components/products/Comment.vue';
    import RequestLoginDialog from '@/components/shared/RequestLoginDialog.vue';

    const defaultForm = {
        content: '',
        rating: 5,
    };

    export default {
        components: {
            ProductComment,
            RequestLoginDialog,
        },

        props: {
            comments: {
                type: Array,
                default: () => [],
            },
        },

        data() {
            return {
                viewMore: false,
                loading: false,
                form: _cloneDeep(defaultForm),
                rules: {
                },
            };
        },

        computed: {
            authUser() {
                return this.$auth.user;
            },
        },

        methods: {
            async submit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        if (!this.authUser) {
                            this.$router.push({
                                query: _assign({}, this.$route.query, {
                                    redirect: this.$route.fullPath,
                                }),
                            });
                            this.$refs.RequestLoginDialog.open();
                        } else {
                            try {
                                this.loading = true;
                                await this.$api.ratings.create(
                                    this.$route.params.id,
                                    {
                                        ...this.form,
                                        product_id: this.$route.params.id,
                                        status: 'inactive',
                                    },
                                );
                                this.form = _cloneDeep(defaultForm);
                                this.$message.success('Đánh giá sản phẩm thành công, hãy đợi duyệt bình luận của bạn');
                            } catch (error) {
                                this.$handleError(error);
                            } finally {
                                this.loading = false;
                            }
                        }
                    }
                });
            },
        },
    };
</script>
