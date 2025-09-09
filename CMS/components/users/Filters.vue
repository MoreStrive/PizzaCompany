<template>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SearchFilter
            label="Tìm kiếm"
            placeholder="Tên, email, SĐT khách hàng"
            query="freeWord"
        />
        <SelectFilter
            label="Giới tính"
            placeholder="Chọn giới tính"
            query="gender"
            :options="USER_GENDER_OPTIONS"
        />
    </div>
</template>

<script>
    import { USER_GENDER_OPTIONS } from '@/constants/user/gender';
    import SelectFilter from '@/components/filters/Select.vue';
    import SearchFilter from '@/components/filters/Search.vue';

    export default {
        components: {
            SelectFilter,
            SearchFilter,
        },

        data() {
            return {
                USER_GENDER_OPTIONS,
            };
        },
    };
</script>
