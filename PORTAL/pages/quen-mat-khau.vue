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
        <GetOtpForm
            v-if="!showNewPasswordInput"
            :loading="loading"
            class="!mt-3 min-w-[200px] max-w-md w-full"
            @submit="showPasswordInput"
        />
        <NewPassword v-if="showNewPasswordInput" @submit="newPassword" />
        <div class="mt-2 flex justify-end w-full">
            <nuxt-link class="underline" to="/dang-nhap">
                Đăng nhập
            </nuxt-link>
        </div>
    </div>
</template>

<script>
    import GetOtpForm from '@/components/auth/forms/GetOtp.vue';
    import NewPassword from '@/components/auth/forms/NewPassword.vue';

    export default {
        layout: 'auth',
        auth: 'guest',

        components: {
            GetOtpForm,
            NewPassword,
        },

        data() {
            return {
                loading: false,
                error: null,

                showNewPasswordInput: false,
                email: '',
                token: '',
            };
        },

        methods: {
            showPasswordInput(data) {
                if (data) {
                    this.email = data.email;
                    this.token = data.token;
                    this.showNewPasswordInput = true;
                }
            },
            async newPassword(form) {
                this.loading = true;

                try {
                    await this.$api.auth.resetPassword({
                        ...form,
                        email: this.email,
                        token: this.token,
                    });
                    this.$message.success('Đổi mật khẩu thành công');
                    this.loading = false;
                    this.$router.push('/dang-nhap');
                } catch (e) {
                    this.$handleError(e);
                }
            },
        },

        head() {
            return {
                title: 'Lấy lại mật khẩu',
            };
        },
    };
</script>
