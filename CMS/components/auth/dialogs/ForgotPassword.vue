<template>
    <div :class="{ 'forget-password-active': statusForgetPassword }" class="forget-password flex flex-col justify-center items-center absolute w-full h-full p-5 top-0 left-0 bg-[#111827] z-10 duration-500 ease-in-out opacity-0 scale-0">
        <div class="text-center bg-white relative z-[4] w-full md2:w-4/5 py-9 px-6 rounded-md">
            <h4 class="text-3xl mb-5 text-primary-100">
                Quên mật khẩu
            </h4>
            <p class="text-xl mb-5">
                Vui lòng liên hệ phòng Hành chính - Nhân sự để được cung cấp lại mật khẩu <br>
                Trân trọng !!
            </p>
            <p class="text-xl mb-1">
                <span class="font-semibold text-primary-100">Email:</span> hcns.mai@flextech.vn
            </p>
            <p class="text-xl mb-0">
                <span class="font-semibold text-primary-100">Telegram:</span> Ms Mai - 0333 897 093
            </p>
            <a-button class="mt-5 w-32" type="primary" @click="toggleForgetPass">
                Quay lại
            </a-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ForgetPassword',
        data() {
            return {
                statusForgetPassword: false,
            };
        },
        methods: {
            toggleForgetPass() {
                this.statusForgetPassword = !this.statusForgetPassword;
            },
        },
    };
</script>

<style lang="scss">
    .forget-password {
        &.forget-password-active {
            @apply origin-center scale-100 opacity-100
        }
        .ant-btn-primary {
            @apply bg-primary-100 border-primary-100
        }
    }
</style>
