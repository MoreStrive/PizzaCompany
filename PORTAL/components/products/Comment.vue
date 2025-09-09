<template>
    <div class="nc-ReviewItem flex flex-col " data-nc-id="ReviewItem">
        <div v-if="comment.user" class=" flex space-x-4 ">
            <div class="flex-shrink-0 pt-0.5">
                <div class="wil-avatar relative flex-shrink-0 inline-flex items-center justify-center text-neutral-100 uppercase font-semibold shadow-inner rounded-full h-10 w-10 text-lg ring-1 ring-white">
                    <img class="absolute inset-0 w-full h-full object-cover rounded-full" :src="comment.user.avatar" alt="Dahon Stiven">
                    <span class="wil-avatar__name">D</span>
                </div>
            </div>
            <div class="flex-1 flex justify-between">
                <div class="text-sm sm:text-base">
                    <span class="block font-semibold">{{ comment.user.full_name }}</span>
                    <span class="block mt-0.5 text-slate-500 text-sm">{{ comment.createdAt | dateFormat('HH:mm dd/MM/yyyy') }}</span>
                </div>
                <div class="mt-0.5 flex gap-x-1 text-yellow-500">
                    <a-rate :value="comment.rating" disabled />
                </div>
            </div>
        </div>
        <div class="mt-4 prose prose-sm sm:prose sm:max-w-2xl">
            <p class="text-slate-600">
                {{ comment.content }}
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            comment: {
                type: Object,
                default: () => {},
            },
        },
        data() {
            return {

            };
        },
    };
</script>
