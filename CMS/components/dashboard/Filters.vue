<template>
    <DateRangeFilter
        label=""
        query="date"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        :default-value="[$route.query.from || undefined, $route.query.to || undefined]"
    />
</template>

<script>
    import DateRangeFilter from '@/components/filters/DateRange.vue';

    export default {
        components: {
            DateRangeFilter,
        },

        data() {
            return {
            };
        },
    };
</script>
