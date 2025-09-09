<template>
    <div>
        <div class="card">
            <div class="flex justify-between items-center">
                <PageHeader text="Cập nhật nhân viên" />
                <div class="flex gap-5">
                    <template v-if="staff.id !== $auth.user.id">
                        <a-button
                            v-if="$permission.Admin() || $permission.Manage()"
                            :loading="loading"
                            @click="resetPassword"
                        >
                            Reset mật khẩu
                        </a-button>
                    </template>
                    <template v-if="staff.id === $auth.user.id">
                        <a-button
                            :loading="loading"
                            @click="$refs.UpdatePassword.open()"
                        >
                            Đổi mật khẩu
                        </a-button>
                    </template>
                    <a-button
                        :loading="loading"
                        type="primary"
                        @click="$refs.StaffsForm.submit()"
                    >
                        <i class="fas fa-pen mr-2" />
                        Cập nhật
                    </a-button>
                </div>
            </div>
        </div>
        <a-spin :spinning="loading">
            <div class="mt-4">
                <StaffsForm ref="StaffsForm" :staff="staff" @submit="updateStaff" />
            </div>
        </a-spin>

        <UpdatePassword ref="UpdatePassword" />
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { mapDataFromOptions } from '@/utils/data';
    import StaffsForm from '@/components/staffs/Form.vue';
    import PageHeader from '@/components/shared/PageHeader.vue';
    import UpdatePassword from '@/components/auth/dialogs/UpdatePassword.vue';

    export default {
        components: {
            StaffsForm,
            PageHeader,
            UpdatePassword,
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
            ...mapState('manage', ['staff']),
        },

        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [
                {
                    label: 'Quản lý nhân viên',
                    link: '/staffs-manage',
                }, {
                    label: 'Cập nhật nhân viên',
                    link: '/staffs-manage/create',
                },
            ]);
        },

        methods: {
            mapDataFromOptions,

            async fetchData() {
                try {
                    await this.$store.dispatch('manage/fetchDetail', this.$route.params.id);
                    this.loading = true;
                } catch (e) {
                    this.$handleError(e);
                } finally {
                    this.loading = false;
                }
            },

            async updateStaff(form) {
                try {
                    this.loading = true;
                    await this.$api.manage.update(this.$route.params.id, form);
                    this.$message.success('Cập nhật thông tin nhân viên thành công');
                    this.$nuxt.refresh();
                    if (this.$permission.Admin() || this.$permission.Manage()) {
                        this.$router.push('/staffs-manage');
                    }
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },

            async resetPassword() {
                try {
                    this.loading = true;
                    await this.$api.auth.resetPassword(this.$route.params.id);
                    this.$message.success('Thay đổi mật khẩu thành công');
                    this.$nuxt.refresh();
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },

        head() {
            return {
                title: 'Cập nhật nhân viên',
            };
        },
    };
</script>
