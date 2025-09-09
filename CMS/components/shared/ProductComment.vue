<template>
    <div class="card">
        <p class="font-semibold text-xl">
            Đánh giá sản phẩm
        </p>
        <div id="reviews" class="mt-10">
            <div v-if="comments && comments.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-y-11 gap-x-28">
                <ProductComment v-for="(comment, index) in comments" :key="index" :comment="comment" />
            </div>
            <div v-else class="py-10">
                <a-empty class="" description="Chưa có đánh giá nào" />
            </div>
        </div>
    </div>
</template>

<script>
    import ProductComment from '@/components/shared/Comment.vue';

    export default {
        components: {
            ProductComment,
        },

        props: {
            comments: {
                type: Array,
                default: () => [],
            },
            pagination: {
                type: Object,
                default: () => {},
            },
        },

        data() {
            return {};
        },
    };
</script>
