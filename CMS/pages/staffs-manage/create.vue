<template>
    <div>
        <div class="card">
            <div class="flex justify-between items-center">
                <PageHeader text="Thêm mới nhân viên" />
                <div class="flex gap-5">
                    <a-button
                        :loading="loading"
                        type="primary"
                        @click="$refs.StaffsForm.submit()"
                    >
                        <i class="fas fa-pen mr-2" />
                        Tạo mới
                    </a-button>
                </div>
            </div>
        </div>
        <a-spin :spinning="loading">
            <div class="mt-6">
                <StaffsForm ref="StaffsForm" @submit="createStaff" />
            </div>
        </a-spin>
    </div>
</template>

<script>
    import { mapDataFromOptions } from '@/utils/data';
    import StaffsForm from '@/components/staffs/Form.vue';
    import PageHeader from '@/components/shared/PageHeader.vue';

    export default {
        components: {
            StaffsForm,
            PageHeader,
        },

        data() {
            return {
                loading: false,
            };
        },

        watch: {
        },

        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [
                {
                    label: 'Quản lý nhân viên',
                    link: '/staffs-manage',
                }, {
                    label: 'Thêm mới nhân viên',
                    link: '/staffs-manage/create',
                },
            ]);
        },

        methods: {
            mapDataFromOptions,

            async createStaff(form) {
                try {
                    this.loading = true;
                    await this.$api.manage.create(form);
                    this.$message.success('Thêm mới nhân viên thành công');
                    this.$nuxt.refresh();
                    this.$router.push('/staffs-manage');
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },

        head() {
            return {
                title: 'Thêm mới nhân viên',
            };
        },
    };
</script>
