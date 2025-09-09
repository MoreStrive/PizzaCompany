<template>
    <a-form-model
        ref="form"
        :model="form"
        class="form-customize"
    >
        <div class="grid grid-cols-3 gap-10">
            <div class="form-customize-item flex items-center gap-x-3 gap-y-5 px-3">
                <span><i class="fas fa-user text-white text-xl" /></span>
                <a-form-model-item placeholder="Tên của bạn" class="flex-1">
                    <a-input v-model="form.fullname" placeholder="Tên của bạn" />
                </a-form-model-item>
            </div>
            <div class="form-customize-item flex items-center gap-3 px-3">
                <span><i class="fas fa-user text-white text-xl" /></span>
                <a-form-model-item placeholder="Số điện thoại" class="flex-1">
                    <a-input v-model="form.phone_number" placeholder="Nhập số điện thoại" />
                </a-form-model-item>
            </div>
            <div class="form-customize-item flex items-center gap-3 px-3">
                <span><i class="fas fa-user text-white text-xl" /></span>
                <a-form-model-item placeholder="Email của bạn" class="flex-1">
                    <a-input v-model="form.email" placeholder="Email của bạn" />
                </a-form-model-item>
            </div>

            <div class="col-span-3 form-customize-item flex items-center gap-3 px-3">
                <span><i class="fas fa-user text-white text-xl" /></span>
                <a-form-model-item placeholder="Lời nhắn gửi" class="flex-1">
                    <a-input v-model="form.content" placeholder="Lời nhắn gửi" />
                </a-form-model-item>
            </div>
        </div>

        <div class="text-center mt-10">
            <span
                class="inline-block px-6 py-3 font-normal border-[1px] border-primary-100 border-solid text-white  rounded transition-all duration-300 bg-primary-100 hover:bg-white hover:text-primary-100 cursor-pointer"
                @click="submitForm"
            >
                Gửi ngay
            </span>
        </div>
    </a-form-model>
</template>
<script>
    export default {
        data() {
            return {
                form: {
                    fullname: '',
                    phone_number: '',
                    email: '',
                    content: '',
                },
            };
        },
        methods: {
            submitForm() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        await this.$api.settings.createContact(this.form);
                        this.$message.success('Gửi thành công');
                        this.resetForm();
                    } else {
                        return false;
                    }
                });
            },
            resetForm() {
                this.$refs.form.resetFields();
            },
        },
    };
</script>

<style lang="scss">
.form-customize {
  input {
    @apply shadow-none text-white font-light text-xl bg-transparent border-transparent #{!important}
  }
  input::placeholder {
    @apply text-white font-light text-xl #{!important}
  }

  &-item {
    @apply border-b-[2px] border-solid border-white pb-3
  }
}
</style>
