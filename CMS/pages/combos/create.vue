<template>
    <div>
        <div class="card space-y-4">
            <div class="flex items-center justify-between">
                <PageHeader text="Quản lý Combo" />
                <a-button type="primary" :loading="loading" @click="$refs.ComboForm.submit()">
                    Thêm Combo
                </a-button>
            </div>
        </div>

        <div class="space-y-4 mt-4">
            <ComboForm ref="ComboForm" :loading="loading" @submit="create" />
        </div>
    </div>
</template>

<script>
    import PageHeader from '@/components/shared/PageHeader.vue';
    import ComboForm from '@/components/combos/Form.vue';
    import { convertToFormData } from '@/utils/form';

    export default {
        components: {
            PageHeader,
            ComboForm,
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
        },

        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Danh sách Combo',
                link: '/combos',
            }, {
                label: 'Thêm Combo mới',
                link: '/combos/create',
            }]);
        },

        methods: {
            async fetchData() {
                try {
                    await this.$store.dispatch('categories/fetchAll');
                    this.loading = true;
                } catch (e) {
                    this.$handleError(e);
                } finally {
                    this.loading = false;
                }
            },

            async create(payload, fileThumbnail) {
                try {
                    this.loading = true;
                    const _payload = payload;
                    if (fileThumbnail) {
                        const { data: { fileAttributes } } = await this.$api.uploaders.uploadFiles(convertToFormData({
                            files: fileThumbnail,
                        }));
                        _payload.thumbnail = fileAttributes[0]?.source;
                    }
                    await this.$api.combos.create(_payload);
                    this.$message.success('Thêm Combo thành công');
                    this.$router.push('/combos');
                } catch (e) {
                    this.$handleError(e);
                } finally {
                    this.loading = false;
                }
            },
        },

        head() {
            return {
                title: 'Thêm Combo mới',
            };
        },
    };
</script>
