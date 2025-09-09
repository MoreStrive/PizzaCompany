<template>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SearchFilter
            label="Tìm kiếm"
            placeholder="Tên sản phẩm, mô tả, nội dung,..."
            query="freeWord"
        />
        <SelectRemote
            label="Danh mục"
            placeholder="Chọn danh mục"
            fetch-url="categories/fetchAll"
            option-label="title"
            option-value="id"
            store="categories"
            store-prop="categories"
            query="category"
            router
        />
    </div>
</template>

<script>
    import { USER_GENDER_OPTIONS } from '@/constants/user/gender';
    import SelectRemote from '@/components/filters/SelectRemote.vue';
    import SearchFilter from '@/components/filters/Search.vue';

    export default {
        components: {
            SelectRemote,
            SearchFilter,
        },

        data() {
            return {
                USER_GENDER_OPTIONS,
            };
        },
    };
</script>
