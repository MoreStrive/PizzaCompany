<template>
    <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        class="space-y-4 w-full"
    >
        <a-form-model-item label="Mã xác thực" prop="otp">
            <a-input
                v-model="form.otp"
                size="large"
                placeholder="Nhập mã xác thực"
                @keyup.native.enter="handleSubmit"
            />
        </a-form-model-item>
        <a-button
            :loading="loading"
            type="primary"
            size="large"
            class="w-full"
            :disabled="form.otp === ''"
            @click="handleSubmit"
        >
            Xác nhận
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
                    otp: '',
                },
                rules: {
                    otp: [
                        {
                            required: true,
                            message: 'Please enter the verification code',
                            trigger: 'blur',
                        },
                    ],
                },
            };
        },

        methods: {
            handleSubmit() {
                this.$emit('submit', {
                    otp: this.form.otp,
                });
            },
        },
    };
</script>
