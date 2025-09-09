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
        <div v-if="!showVerification" class="mb-6 text-center" />
        <div v-else class="mb-6 text-center">
            <div class="text-[#161a21]">
                Kiểm tra <b class="text-[#53c66e]">{{ email }}</b> để nhận mã xác thực.
            </div>
        </div>
        <VerifyForm
            v-if="showVerification"
            :loading="loading"
            :email="email"
            class="!mt-3"
            @submit="verify"
        />
        <SignUpForm
            v-else
            :loading="loading"
            class="!mt-3"
            @submit="signup"
        />
    </div>
</template>

<script>
    import SignUpForm from '@/components/auth/forms/SignUp.vue';
    import VerifyForm from '@/components/auth/forms/Verify.vue';

    export default {
        layout: 'auth',

        auth: 'guest',

        components: {
            SignUpForm,
            VerifyForm,
        },

        data() {
            return {
                loading: false,
                error: null,
                email: '',
                password: '',
                showVerification: false,
            };
        },

        methods: {
            async signup(form) {
                this.loading = true;
                try {
                    this.email = form.email;
                    this.password = form.password;
                    await this.$api.auth.register({
                        ...form,
                    });
                    this.showVerification = true;
                    this.loading = false;
                } catch (error) {
                    this.$handleError(error, (_error) => {
                        const errorData = _error?.response?.data;
                        this.error = 'Email đã được sử dụng, vui lòng nhập email khác!';
                        if (errorData?.code === 401) {
                            console.log(errorData);
                        }
                    });
                    this.loading = false;
                }
            },
            async verify(form) {
                try {
                    this.loading = true;
                    await this.$api.auth.verifyEmail({
                        ...form,
                        email: this.email,
                    });
                    await this.$auth
                        .loginWith('local', {
                            data: {
                                ...form,
                                username: this.email,
                                password: this.password,
                            },
                        })
                        .then(async () => {
                            // login success and set data into localStorage
                            this.$auth.$storage.setLocalStorage('data', form);
                            this.$message.success('Đăng nhập thành công');
                            this.$router.push('/');
                        })
                        .catch(() => {
                            this.loading = false;
                        })
                        .finally(() => {
                            this.loading = false;
                        });
                    this.loading = false;
                } catch (error) {
                    this.loading = false;
                    this.$handleError(error, (_error) => {
                        const errorData = _error?.response?.data;
                        this.error = 'Mã xác thực không chính xác!';
                        if (errorData?.code === 401) {
                            console.log(errorData);
                        }
                    });
                }
            },
        },

        head() {
            return {
                title: 'Đăng ký tài khoản',
            };
        },
    };
</script>
