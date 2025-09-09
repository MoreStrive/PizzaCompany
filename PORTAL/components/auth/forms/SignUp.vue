<template>
    <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        class="space-y-6 w-full"
    >
        <a-form-model-item label="Họ và tên" prop="full_name">
            <a-input
                v-model="form.full_name"
                size="large"
                placeholder="Nhập họ và tên của bạn"
                @keyup.native.enter="handleSubmit"
            />
        </a-form-model-item>
        <a-form-model-item label="Tên đăng nhập" prop="username">
            <a-input
                v-model="form.username"
                size="large"
                placeholder="Nhập tên đăng nhập của bạn"
                @keyup.native.enter="handleSubmit"
            />
        </a-form-model-item>
        <a-form-model-item label="Mật khẩu" prop="password">
            <a-input-password
                v-model="form.password"
                size="large"
                placeholder="Nhập mật khẩu của bạn"
                @keyup.native.enter="handleSubmit"
            />
        </a-form-model-item>
        <a-form-model-item label="Email của bạn" prop="email">
            <a-input
                v-model="form.email"
                size="large"
                placeholder="Nhập email của bạn"
                @keyup.native.enter="handleSubmit"
            />
        </a-form-model-item>
        <a-form-model-item label="Số điện thoại" prop="phone_number">
            <a-input
                v-model="form.phone_number"
                size="large"
                placeholder="Nhập số điện thoại của bạn"
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
            Đăng ký
        </a-button>
        <div class="mt-2 flex justify-between">
            <nuxt-link class="underline !text-prim-100 !hover:text-[#1ebd23]" to="/dang-nhap">
                Đăng nhập
            </nuxt-link>
        </div>
    </a-form-model>
</template>

<script>
    import _cloneDeep from 'lodash/cloneDeep';
    import { validEmail, passwordValidtor } from '@/utils/form';

    const defaultForm = {
        email: '',
        password: '',
        full_name: '',
        username: '',
        phone_number: '',
    };

    export default {
        props: {
            loading: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                form: _cloneDeep(defaultForm),
                rules: {
                    full_name: [
                        {
                            required: true,
                            message: 'Vui lòng nhập họ tên của bạn',
                            trigger: 'blur',
                        },
                    ],
                    username: [
                        {
                            required: true,
                            message: 'Vui lòng nhập tên đăng nhập của bạn',
                            trigger: 'blur',
                        },
                    ],
                    phone_number: [
                        {
                            required: true,
                            message: 'Vui lòng số điện thoại của bạn',
                            trigger: 'blur',
                        },
                    ],
                    email: [
                        {
                            required: true,
                            message: 'Vui lòng nhập Email của bạn',
                            trigger: 'blur',
                            validator: validEmail,
                        },
                    ],
                    password: [
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu của bạn',
                            trigger: 'blur',
                        }, {
                            validator: passwordValidtor, trigger: ['change'],
                        },
                    ],
                },
            };
        },
        mounted() {
        },

        methods: {
            handleSubmit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        this.$emit('submit', this.form);
                    }
                });
            },
        },
    };
</script>
