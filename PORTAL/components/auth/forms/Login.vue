<template>
    <div>
        <a-form-model
            ref="form"
            :model="form"
            :rules="rules"
            class="space-y-6 w-full"
        >
            <a-form-model-item label="Email hoặc tên đăng nhập" prop="username">
                <a-input
                    v-model="form.username"
                    size="large"
                    placeholder="Email hoặc tên đăng nhập của bạn"
                    class=""
                    @keyup.native.enter="handleSubmit"
                />
            </a-form-model-item>
            <a-form-model-item label="Mật khẩu" prop="password">
                <a-input-password
                    v-model="form.password"
                    size="large"
                    placeholder="Nhập mật khẩu"
                    @keyup.native.enter="handleSubmit"
                />
            </a-form-model-item>
            <a-button
                :loading="loading"
                type="primary"
                size="large"
                class="w-full !mt-8"
                @keyup.native.enter="handleSubmit"
                @click="handleSubmit"
            >
                Đăng nhập
            </a-button>
            <div class="mt-2 flex justify-between">
                <nuxt-link class="underline" to="/dang-ky">
                    Đăng ký
                </nuxt-link>
                <nuxt-link class="underline" to="/quen-mat-khau">
                    Quên mật khẩu
                </nuxt-link>
            </div>
        </a-form-model>
    </div>
</template>

<script>
    import _cloneDeep from 'lodash/cloneDeep';
    import { validEmail } from '@/utils/form';

    const defaultForm = {
        username: '',
        password: '',
    };

    export default {
        components: {
        },
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
                    username: [
                        {
                            required: true,
                            message: 'Vui lòng nhập Email hoặc tên đăng nhập',
                            trigger: 'blur',
                            validator: validEmail,
                        },
                    ],
                    password: [
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu để đăng nhập',
                            trigger: 'blur',
                        },
                    ],
                },
            };
        },

        methods: {
            handleSubmit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        this.$emit('submit', {
                            ...this.form,
                        });
                    }
                });
            },
        },
    };
</script>
