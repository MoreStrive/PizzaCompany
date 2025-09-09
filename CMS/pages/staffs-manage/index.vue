<template>
    <div>
        <div class="card">
            <StaffsFilters />
        </div>
        <div class="card mt-4">
            <div class="flex justify-between items-center">
                <PageHeader text="Quản lý nhân viên" />
                <div v-if="$permission.Admin() || $permission.Manage()" class="flex gap-5">
                    <nuxt-link to="/staffs-manage/create">
                        <a-button type="primary">
                            <i class="fas fa-plus mr-2" />
                            Thêm mới
                        </a-button>
                    </nuxt-link>
                </div>
            </div>
            <div class="mt-4">
                <StaffsTable :staffs="staffs" :loading="loading" :pagination="pagination" />
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { mapDataFromOptions } from '@/utils/data';
    import StaffsTable from '@/components/staffs/Table.vue';
    import StaffsFilters from '@/components/staffs/Filters.vue';
    import PageHeader from '@/components/shared/PageHeader.vue';

    export default {
        components: {
            StaffsTable,
            StaffsFilters,
            PageHeader,
        },

        async fetch() {
            await this.fetchData();
        },
        data() {
            return {
                loading: false,
            };
        },

        computed: {
            ...mapState('manage', ['staffs', 'pagination']),
        },

        watch: {
            '$route.query': {
                async handler() {
                    await this.fetchData();
                },
                deep: true,
                immediate: true,
            },
        },

        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Danh sách nhân viên',
                link: '/staffs-manage',
            }]);
        },

        methods: {
            mapDataFromOptions,

            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('manage/fetchAll', this.$route.query);
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },

        head() {
            return {
                title: 'Quản lý nhân viên',
            };
        },
    };
</script>
