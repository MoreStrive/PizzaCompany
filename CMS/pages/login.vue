<template>
    <div class="flex flex-col items-center">
        <div slot="title" class="mt-4 mb-4 text-4xl font-medium text-primary-100 text-center">
            {{ isLogin ? 'Đăng nhập' : 'Đăng ký' }}
        </div>
        <div v-if="isLogin" class="w-full">
            <a-alert
                v-if="error"
                class="!mt-3 w-full"
                :message="error"
                type="warning"
                show-icon
            />
            <LoginForm
                ref="formLogin"
                :loading="loading"
                class="!mt-3 min-w-[200px] max-w-md w-full"
                @submit="login"
            />
            <a-button
                :loading="loading"
                type="primary"
                class="w-full mt-10"
                @click="$refs.formLogin.submit()"
            >
                Đăng nhập
            </a-button>
        </div>
    </div>
</template>

<script>
    import LoginForm from '@/components/auth/forms/Login.vue';

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
                isLogin: true,
            };
        },

        methods: {
            async login(form) {
                try {
                    this.loading = true;
                    await this.$auth.loginWith('local', { data: form });
                    this.$router.push('/');
                    this.$message.success('Đăng nhập thành công');
                } catch {
                    this.$message.error('Sai email hoặc mật khẩu');
                } finally {
                    this.loading = false;
                }
            },
            async register(form) {
                try {
                    this.loading = true;
                    await this.$api.auth.signUp(form);
                    this.isLogin = true;
                    this.$message.success('Đăng ký thành công');
                } catch {
                    this.$message.error('Thất bại');
                } finally {
                    this.loading = false;
                }
            },
        },

        head() {
            return {
                title: 'Login | LMS',
            };
        },
    };
</script>
