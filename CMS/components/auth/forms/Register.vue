<template>
    <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
    >
        <a-form-model-item prop="username" label="Tên tài khoản" class="!mb-2">
            <a-input
                v-model="form.username"
                placeholder="Nhập tên tài khoản"
                @keyup.native.enter="submit"
            >
                <template #prefix>
                    <i class="far fa-user text-primary-100" />
                </template>
            </a-input>
        </a-form-model-item>
        <a-form-model-item prop="full_name" label="Họ và tên" class="!mb-2">
            <a-input
                v-model="form.full_name"
                placeholder="Nhập họ và tên đầy đủ"
                @keyup.native.enter="submit"
            >
                <template #prefix>
                    <i class="fas fa-envelope text-primary-100" />
                </template>
            </a-input>
        </a-form-model-item>
        <a-form-model-item prop="password" label="Mật khẩu" class="!mb-2">
            <a-input-password
                v-model="form.password"
                placeholder="Nhập mật khẩu"
                @keyup.native.enter="submit"
            >
                <template #prefix>
                    <i class="fas fa-unlock-alt text-primary-100" />
                </template>
            </a-input-password>
        </a-form-model-item>
    </a-form-model>
</template>

<script>
    import _cloneDeep from 'lodash/cloneDeep';

    const defaultForm = {
        username: '',
        full_name: '',
        password: '',
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
                    username: [
                        { required: true, message: 'Không được để trống trường này', trigger: 'blur' },
                    ],
                    password: [
                        { required: true, message: 'Không được để trống trường này', trigger: 'blur' },
                    ],
                    full_name: [
                        { required: true, message: 'Không được để trống trường này', trigger: 'blur' },
                    ],
                },
            };
        },

        methods: {
            submit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        this.$emit('submit', this.form);
                    }
                });
            },
        },
    };
</script>
