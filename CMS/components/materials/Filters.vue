<template>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SearchFilter
            label="Tìm kiếm"
            placeholder="Tên nguyên liệu, mã nguyên liệu"
            query="freeWord"
        />
    </div>
</template>

<script>
    import SearchFilter from '@/components/filters/Search.vue';

    export default {
        components: {
            SearchFilter,
        },

        data() {
            return {
            };
        },
    };
</script>
