<template>
    <div>
        <div class="card space-y-4">
            <div class="flex items-center justify-between">
                <PageHeader text="Quản lý Combo" />
                <nuxt-link to="/combos/create">
                    <a-button type="primary">
                        Thêm combo
                    </a-button>
                </nuxt-link>
            </div>
        </div>

        <div class="card space-y-4 mt-4">
            <ComboTable :combos="combos" :pagination="pagination" :loading="loading" />
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import PageHeader from '@/components/shared/PageHeader.vue';
    import ComboTable from '@/components/combos/Table.vue';

    export default {
        components: {
            PageHeader,
            ComboTable,
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
            ...mapState('combos', ['combos', 'pagination']),
        },

        watch: {
            '$route.query': {
                async handler() {
                    await this.fetchData();
                },
            },
            deep: true,
        },

        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Danh sách Combo',
                link: '/',
            }]);
        },

        methods: {
            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('combos/fetchAll', this.$route.query);
                } catch (e) {
                    this.$handleError(e);
                } finally {
                    this.loading = false;
                }
            },
        },

        head() {
            return {
                title: 'Quản lý Combo',
            };
        },
    };
</script>
