<template>
    <div class="h-[400px]">
        <VueApexCharts
            type="area"
            height="350"
            :options="chartOptions"
            :series="series"
        />
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    // import moment from 'moment';

    export default {
        data() {
            return {
                unit: undefined,
                loading: false,
            };
        },

        computed: {
            ...mapState('dashboard', ['dashboard']),
            series() {
                return [{
                    name: 'Đơn hàng',
                    data: this.dashboard.orders && this.dashboard.orders.map((order) => (order.orderCount)),
                }];
            },

            chartOptions() {
                return {
                    chartOptions: {
                        chart: {
                            height: 350,
                            type: 'area',
                        },
                        dataLabels: {
                            enabled: false,
                        },
                        stroke: {
                            curve: 'smooth',
                        },
                        xaxis: {
                            type: 'datetime',
                            categories: this.dashboard.orders && this.dashboard.orders.map((order) => (order.id)),
                        },
                    },
                };
            },
        },

        watch: {

        },

        methods: {

        },
    };
</script>
