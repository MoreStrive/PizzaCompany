<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        title="Đổi mật khẩu"
    >
        <a-form-model
            ref="form"
            :model="form"
            :rules="rules"
            layout="vertical"
            :colon="false"
        >
            <a-form-model-item label="Mật khẩu mới" prop="password">
                <a-input-password v-model="form.password" placeholder="Nhập mật khẩu mới" />
            </a-form-model-item>
        </a-form-model>
        <div slot="footer" class="flex justify-center items-center gap-2">
            <a-button class="w-28" @click="close">
                Hủy bỏ
            </a-button>
            <a-button
                :loading="loading"
                class="w-28"
                type="primary"
                @click="updatePassword"
            >
                Cập nhật
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    export default {
        data() {
            return {
                visible: false,
                loading: false,
                room: null,
                form: {},
                rules: {
                    password: [{
                        required: true, message: 'Vui lòng nhập lại mật khẩu mới', trigger: 'blur',
                    }],
                    user: null,
                },
            };
        },

        methods: {
            open(user) {
                this.form = {
                    password: '',
                };
                this.user = user;
                this.visible = true;
            },

            close() {
                this.visible = false;
            },

            async updatePassword() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        try {
                            this.loading = true;
                            await this.$api.users.update(this.user.id, this.form);
                            this.$message.success('Cập nhật mật khẩu mới thành công');
                            this.close();
                        } catch (error) {
                            this.$handleError(error, (_error) => {
                                const errorData = _error?.response?.data;
                                if (errorData?.error?.code === 425) {
                                    this.$message.warning('Mật khẩu cũ không chính xác');
                                }
                            });
                        } finally {
                            this.loading = false;
                        }
                    }
                });
            },
        },
    };
</script>
