<template>
    <div>
        <div class="card">
            <div class="flex justify-between items-center">
                <PageHeader text="Danh sách liên hệ" />
            </div>
        </div>
        <div class="card mt-4">
            <ContactsTable :contacts="contacts" :loading="loading" />
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import ContactsTable from '@/components/contacts/Table.vue';
    import PageHeader from '@/components/shared/PageHeader.vue';

    export default {
        components: {
            ContactsTable,
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
            ...mapState('contacts', ['contacts']),
            breadcrumbs() {
                return [{
                    label: 'Danh sách liên hệ',
                    link: '/contacts',
                }];
            },
        },

        watch: {
            breadcrumbs() {
                this.$store.commit('breadcrumbs/SET_BREADCRUMBS', this.breadcrumbs);
            },
        },

        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', this.breadcrumbs);
        },

        methods: {
            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('contacts/fetchAll', this.$route.query);
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },

        head() {
            return {
                title: 'Danh sách liên hệ',
            };
        },
    };
</script>
