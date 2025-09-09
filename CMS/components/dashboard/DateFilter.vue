<template>
    <DateFilter
        label=""
        query="date"
        placeholder="Chọn ngày"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
    />
</template>

<script>
    import DateFilter from '@/components/filters/Date.vue';

    export default {
        components: {
            DateFilter,
        },

        data() {
            return {
            };
        },
    };
</script>
