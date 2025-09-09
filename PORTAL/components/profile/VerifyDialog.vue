<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        title="Xác minh tài khoản"
        :footer="false"
    >
        <div class="pb-3">
            <a-alert
                v-if="error"
                class="!my-3 w-full"
                :message="error"
                type="warning"
                show-icon
            />
            <VerifyForm
                :loading="loading"
                :email="email"
                @submit="verify"
            />
        </div>
    </a-modal>
</template>

<script>
    import VerifyForm from '@/components/auth/forms/Verify.vue';

    export default {
        components: {
            VerifyForm,
        },

        data() {
            return {
                error: null,
                visible: false,
                loading: false,
                email: this.$auth.user.email,
            };
        },

        methods: {
            open() {
                this.visible = true;
            },

            close() {
                this.visible = false;
            },

            async verify(form) {
                try {
                    this.loading = true;
                    await this.$api.auth.verifyEmail({
                        ...form,
                        email: this.email,
                    });
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
    };
</script>
