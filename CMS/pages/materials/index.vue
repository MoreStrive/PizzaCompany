<template>
    <div>
        <div class="card mb-4">
            <MaterialFilters />
        </div>
        <div class="card">
            <div class="flex justify-between items-center">
                <PageHeader text="Danh sách nguyên liệu" />
                <button v-if="$permission.Admin() || $permission.Manage()" @click="$refs.MaterialDialog.open()">
                    <a-button type="primary">
                        <i class="fas fa-plus mr-2" />
                        Thêm mới
                    </a-button>
                </button>
            </div>
            <MaterialTable
                class="mt-4"
                :materials="materials"
                :loading="loading"
            />
            <MaterialDialog ref="MaterialDialog" />
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import MaterialTable from '@/components/materials/Table.vue';
    import MaterialDialog from '@/components/materials/Dialog.vue';
    import PageHeader from '@/components/shared/PageHeader.vue';
    import MaterialFilters from '@/components/materials/Filters.vue';

    export default {
        components: {
            MaterialTable,
            MaterialDialog,
            PageHeader,
            MaterialFilters,
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
            ...mapState('materials', ['materials']),
        },
        watch: {
            '$route.query': {
                handler() {
                    this.fetchData();
                },
            },
        },
        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Danh sách nguyên liệu',
                link: '/materials',
            }]);
        },

        methods: {

            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('materials/fetchAll', this.$route.query);
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },

        head() {
            return {
                title: 'Danh sách nguyên liệu',
            };
        },
    };
</script>
