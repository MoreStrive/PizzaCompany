<template>
    <div>
        <div class="card">
            <div class="flex justify-between items-center">
                <PageHeader text="Cập nhật người dùng" />
                <div class="flex gap-5">
                    <a-button
                        :loading="loading"
                        type="primary"
                        @click="$refs.UsersForm.submit()"
                    >
                        <i class="fas fa-pen mr-2" />
                        Cập nhật
                    </a-button>
                </div>
            </div>
        </div>
        <a-spin :spinning="loading">
            <div class="mt-6">
                <UsersForm ref="UsersForm" :user="user" @submit="updateUser" />
            </div>
        </a-spin>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import UsersForm from '@/components/users/Form.vue';
    import PageHeader from '@/components/shared/PageHeader.vue';

    export default {
        components: {
            UsersForm,
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
            ...mapState('users', ['user']),
        },

        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [
                {
                    label: 'Quản lý người dùng',
                    link: '/users-manage',
                }, {
                    label: 'Cập nhật người dùng',
                    link: `/users-manage/${this.user.id}/update`,
                },
            ]);
        },

        methods: {
            async fetchData() {
                try {
                    await this.$store.dispatch('users/fetchDetail', this.$route.params.id);
                    this.loading = true;
                } catch (e) {
                    this.$handleError(e);
                } finally {
                    this.loading = false;
                }
            },

            async updateUser(form) {
                try {
                    this.loading = true;
                    await this.$api.users.update(this.$route.params.id, form);
                    this.$message.success('Cập nhật người dùng thành công');
                    this.$nuxt.refresh();
                    this.$router.push('/users-manage');
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },

        head() {
            return {
                title: 'Cập nhật người dùng',
            };
        },
    };
</script>
