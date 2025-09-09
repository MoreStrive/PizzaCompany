<template>
    <div v-if="comment" class="nc-ReviewItem flex flex-col " data-nc-id="ReviewItem">
        <div class=" flex space-x-4 ">
            <div v-if="comment.user" class="flex-shrink-0 pt-0.5">
                <div class="wil-avatar relative flex-shrink-0 inline-flex items-center justify-center text-neutral-100 uppercase font-semibold shadow-inner rounded-full h-10 w-10 text-lg ring-1 ring-white">
                    <img class="absolute inset-0 w-full h-full object-cover rounded-full" :src="comment.user && comment.user.avatar" alt="Dahon Stiven">
                    <span class="wil-avatar__name">D</span>
                </div>
            </div>
            <div v-if="comment.user" class="flex-1 flex justify-between">
                <div class="text-sm sm:text-base">
                    <span class="block font-semibold">
                        <span class="mr-2">{{ comment.user && comment.user.full_name }} </span>
                        <a-rate :value="comment.rating" disabled />
                    </span>
                    <span class="block mt-0.5 text-slate-500 text-sm">{{ comment.created_at | dateFormat('HH:mm dd/MM/yyyy') }}</span>
                </div>
                <div class="mt-0.5 flex gap-x-1 text-yellow-500">
                    <div class="flex items-center justify-center gap-2">
                        <a-button
                            type="primary"
                            class="!leading-[10px]"
                            @click="confirmComment"
                        >
                            <span v-if="comment.status === 'active'">Ẩn</span>
                            <span v-else>Hiển thị</span>
                        </a-button>
                        <a-button
                            class="!leading-[10px]"
                            @click="() => {
                                $refs.ConfirmDialog.open(),
                                commentSelected = comment
                            }"
                        >
                            <i class="isax isax-trash" />
                        </a-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-4 prose prose-sm sm:prose sm:max-w-2xl">
            <p class="text-slate-600">
                {{ comment.content }}
            </p>
        </div>

        <ConfirmDialog
            ref="ConfirmDialog"
            title="Xóa bình luận"
            content="Bạn chắc chắn xóa bình luận này ?"
            @confirm="confirmDelete"
        />
    </div>
</template>

<script>
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';

    export default {
        components: {
            ConfirmDialog,
        },

        props: {
            comment: {
                type: Object,
                default: () => {},
            },
        },

        data() {
            return {
                commentSelected: null,
            };
        },

        methods: {
            async confirmComment() {
                try {
                    await this.$api.ratings.update(this.comment.id, { status: this.comment.status === 'active' ? 'inactive' : 'active' });
                    this.$message.success('Thay đổi trạng thái thành công');
                    this.$nuxt.refresh();
                } catch (e) {
                    this.$handleError(e);
                }
            },

            async confirmDelete() {
                try {
                    await this.$api.ratings.delete(this.commentSelected.id);
                    this.$message.success('Xóa thành công');
                    this.$nuxt.refresh();
                } catch (e) {
                    this.$handleError(e);
                }
            },
        },
    };
</script>
