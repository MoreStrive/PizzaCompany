<!-- eslint-disable vue/no-unused-components -->
<template>
    <div class="flex flex-col items-center">
        <a-alert
            v-if="error"
            class="!mt-3 w-full"
            :message="error"
            type="warning"
            show-icon
        />
        <LoginForm
            :loading="loading"
            class="!mt-3 min-w-[200px] max-w-md w-full"
            @submit="login"
        />
    </div>
</template>

<script>
    // import _assign from 'lodash/assign';
    import LoginForm from '@/components/auth/forms/Login.vue';
    import { message } from 'ant-design-vue';

    export default {
        layout: 'auth',
        auth: 'guest',

        components: {
            LoginForm,
        },

        data() {
            return {
                loading: false,
                error: null,
            };
        },

        methods: {
            async login(form) {
                this.loading = true;
                await this.$auth
                    .loginWith('local', {
                        data: form,
                    })
                    .then(async () => {
                        this.$auth.$storage.setLocalStorage('data', form);
                        message.success('Đăng nhập thành công');
                        this.$router.push(this.$route.query.redirect || '/');
                        // this.$router.push({
                        //     query: _assign({}, this.$route.query, {
                        //         redirect: '',
                        //     }),
                        // });
                    })
                    .catch((error) => {
                        this.$handleError(error, (_error) => {
                            const errorData = _error?.response?.data;
                            this.error = 'Tên đăng nhập hoặc mật khẩu không chính xác';
                            if (errorData?.code === 401) {
                                this.$router.push('/dang-nhap');
                            }
                        });
                    }).finally(() => {
                        this.loading = false;
                    });
            },
        },

        head() {
            return {
                title: 'Đăng nhập',
            };
        },
    };
</script>
