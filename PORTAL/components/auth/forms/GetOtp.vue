<template>
    <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        class="space-y-4 w-full"
    >
        <a-form-model-item label="Email" prop="email">
            <a-input
                v-model="form.email"
                :disabled="showOtp"
                size="large"
                placeholder="Nhập email đăng nhập của bạn"
                @keyup.native.enter="handleSubmit"
            />
        </a-form-model-item>
        <a-form-model-item
            v-if="showOtp"
            label="Nhập mã OTP được gửi vào email của bạn"
            prop="otp"
        >
            <a-input
                v-model="form.otp"
                size="large"
                placeholder="Nhập mã OTP ở đây"
                @keyup.native.enter="handleSubmit"
            />
        </a-form-model-item>
        <a-button
            :loading="loading"
            type="primary"
            size="large"
            class="w-full"
            @click="handleSubmit"
        >
            Tiếp tục
        </a-button>
    </a-form-model>
</template>

<script>
    export default {
        props: {
            loading: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                form: {
                    email: '',
                    otp: '',
                },
                showOtp: false,
                rules: {
                    email: [
                        {
                            required: true,
                            message: 'Nhập đúng Email đăng nhập',
                            trigger: 'blur',
                        },
                    ],
                    otp: [
                        {
                            required: true,
                            message: 'Vui lòng nhập mã OTP',
                            trigger: 'blur',
                        },
                    ],
                },
            };
        },

        methods: {
            async handleSubmit() {
                if (!this.showOtp) {
                    try {
                        // send otp to email
                        await this.$api.auth.forgotPassword({
                            email: this.form.email,
                        });
                        this.$message.success('Đã gửi OTP vào email');
                        this.showOtp = true;
                    } catch (error) {
                        this.$message.error('Email không chính xác hoặc đã có lỗi xảy ra!');
                    }
                } else {
                    try {
                        // verify otp and then emit to forgot-password.vue
                        const data = await this.$api.auth.verifyOtp(this.form);
                        this.$emit('submit', {
                            email: this.form.email,
                            token: data.data.token,
                        });
                        this.$message.success('Xác thực OTP thành công');
                    } catch (error) {
                        this.$message.error('Mã xác thực không chính xác!');
                    }
                }
            },
        },
    };
</script>
