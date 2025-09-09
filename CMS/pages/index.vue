<template>
    <div>
        <div class="card">
            <div class="flex items-center justify-between">
                <PageHeader text="Tổng quan" />
            </div>

            <div class="mt-4">
                <h4 class="text-center uppercase text-3xl font-semibold">
                    <div class="flex justify-center items-center gap-5">
                        Báo cáo ngày:
                        <div>
                            <DateFilter v-if="!loading" />
                        </div>
                    </div>
                </h4>
                <div class="grid grid-cols-4 gap-4 mt-10">
                    <div class="duration-150 relative overflow-hidden flex items-center p-6 shadow-md hover:shadow-xl rounded-md bg-primary-90">
                        <span class="ml-5 text-white">
                            <h3 class="text-white uppercase">Số đơn hàng đã bán</h3>
                            <span class="text-4xl mr-1">{{ dashboard.todayOrderCount || 0 }}</span> Đơn
                        </span>
                        <span class="absolute rounded-full -right-28 -top-16 w-44 h-44 bg-white opacity-30" />
                        <span class="absolute rounded-full -right-6 top-14 w-44 h-44 bg-white opacity-40" />
                    </div>
                    <!-- <div class="duration-150 relative overflow-hidden flex items-center p-6 shadow-md hover:shadow-xl rounded-md bg-primary-90">
                        <span class="ml-5 text-white">
                            <h3 class="text-white uppercase">Đơn hàng giao thành công</h3>
                            <span class="text-4xl mr-1">{{ dashboard.todaySuccessCount || 0 }}</span> Đơn
                        </span>
                        <span class="absolute rounded-full -right-28 -top-16 w-44 h-44 bg-white opacity-30" />
                        <span class="absolute rounded-full -right-6 top-14 w-44 h-44 bg-white opacity-40" />
                    </div> -->
                    <div class="duration-150 relative overflow-hidden flex items-center p-6 shadow-md hover:shadow-xl rounded-md bg-primary-90">
                        <span class="ml-5 text-white">
                            <h3 class="text-white uppercase">Doanh thu</h3>
                            <span class="text-4xl mr-1">{{ dashboard.todayFinalPrice | currencyFormat }}</span>
                        </span>
                        <span class="absolute rounded-full -right-28 -top-16 w-44 h-44 bg-white opacity-30" />
                        <span class="absolute rounded-full -right-6 top-14 w-44 h-44 bg-white opacity-40" />
                    </div>
                </div>
            </div>

            <div class="mt-32">
                <h4 class="text-center uppercase text-3xl font-semibold">
                    <div class="flex justify-center items-center gap-5">
                        Đơn hàng và doanh thu:
                        <div>
                            <Filters v-if="!loading" />
                        </div>
                    </div>
                </h4>
                <div class="mt-10">
                    <OrderChart />
                </div>
                <div>
                    <MoneyChart />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import _assign from 'lodash/assign';
    import _isEmpty from 'lodash/isEmpty';
    import { mapState } from 'vuex';
    import PageHeader from '@/components/shared/PageHeader.vue';
    import OrderChart from '@/components/dashboard/OrderChart.vue';
    import MoneyChart from '@/components/dashboard/MoneyChart.vue';
    import Filters from '@/components/dashboard/Filters.vue';
    import DateFilter from '@/components/dashboard/DateFilter.vue';

    export default {
        components: {
            PageHeader,
            OrderChart,
            MoneyChart,
            Filters,
            DateFilter,
        },

        data() {
            return {
                loading: false,
            };
        },

        computed: {
            ...mapState('dashboard', ['dashboard', 'today']),
        },

        watch: {
            '$route.query': {
                async handler() {
                    await this.fetchData();
                },
            },
            deep: true,
        },

        async mounted() {
            if (_isEmpty(this.$route.query)) {
                this.$router.push({
                    query: _assign({}, this.$route.query, {
                        date: moment().format('YYYY-MM-DD'),
                        dateFrom: moment().subtract(30, 'days').format('YYYY-MM-DD'),
                        dateTo: moment().format('YYYY-MM-DD'),
                    }),
                });
            }
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Tổng quan',
                link: '/',
            }]);
            await this.fetchData();
        },

        methods: {
            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('dashboard/fetchAll', this.$route.query);
                } catch (e) {
                    this.$handleError(e);
                } finally {
                    this.loading = false;
                }
            },
        },

        head() {
            return {
                title: 'Tổng quan',
            };
        },
    };
</script>
