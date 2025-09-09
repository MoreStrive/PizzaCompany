<template>
    <div>
        <div class="card">
            <div class="flex justify-between items-center">
                <PageHeader text="Cài đặt thông tin" />
                <a-button type="primary" @click="$refs.SettingForm.submit()">
                    <i class="isax isax-edit mr-2" />
                    Cập nhật
                </a-button>
            </div>
        </div>

        <div class="card flex-grow mt-4">
            <SettingForm ref="SettingForm" :setting="setting" @submit="updateContact" />
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { mapDataFromOptions } from '@/utils/data';
    import SettingForm from '@/components/settings/Form.vue';
    import PageHeader from '@/components/shared/PageHeader.vue';

    export default {
        components: {
            SettingForm,
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
            ...mapState('settings', ['setting']),
        },

        watch: {
        },

        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Cài đặt thông tin',
                link: '/settings',
            }]);
        },

        methods: {
            mapDataFromOptions,

            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('settings/fetchAll');
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },

            async updateContact(form) {
                try {
                    this.loading = true;
                    await this.$store.dispatch('settings/update', form);
                    this.$message.success('Thay đổi thông tin thành công');
                    this.$nuxt.refresh();
                    this.$forceUpdate();
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },

        head() {
            return {
                title: 'Cài đặt thông tin',
            };
        },
    };
</script>
