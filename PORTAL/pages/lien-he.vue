<template>
    <div class="py-20 overflow-hidden">
        <div class="">
            <h2 class="my-10 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 justify-center">
                Liên hệ
            </h2>
            <div class="container max-w-7xl mx-auto">
                <div class="flex-shrink-0 grid grid-cols-1 md:grid-cols-2 gap-12 ">
                    <div class="max-w-sm space-y-8">
                        <div>
                            <h3 class="uppercase font-semibold text-sm tracking-wider">
                                🗺 Địa chỉ
                            </h3><span class="block mt-2 text-neutral-500">{{ setting.address }}</span>
                        </div><div>
                            <h3 class="uppercase font-semibold text-sm tracking-wider">
                                💌 Email
                            </h3><span class="block mt-2 text-neutral-500">{{ setting.email }}</span>
                        </div><div>
                            <h3 class="uppercase font-semibold text-sm tracking-wider">
                                ☎ Hotline
                            </h3><span class="block mt-2 text-neutral-500">{{ setting.phone_number || '' }}</span>
                        </div>
                    </div>
                    <div>
                        <a-form-model
                            ref="contactForm"
                            :model="form"
                            :rules="rules"
                        >
                            <div class="flex flex-col gap-3">
                                <a-form-model-item has-feedback label="Họ và tên của bạn" prop="fullname">
                                    <a-input v-model="form.fullname" placeholder="Họ tên" />
                                </a-form-model-item>
                                <a-form-model-item has-feedback label="Email của bạn" prop="email">
                                    <a-input v-model="form.email" placeholder="Email" />
                                </a-form-model-item>
                                <a-form-model-item has-feedback label="Số điện thoại" prop="phone_number">
                                    <a-input v-model="form.phone_number" placeholder="Số điện thoại" />
                                </a-form-model-item>
                                <a-form-model-item has-feedback label="Lời nhắn" prop="message">
                                    <a-textarea
                                        v-model="form.content"
                                        placeholder="Lời nhắn"
                                        :auto-size="{ minRows: 5, maxRows: 6 }"
                                    />
                                </a-form-model-item>
                            </div>
                        </a-form-model>
                        <button
                            class="relative h-auto inline-flex items-center justify-center rounded-full text-sm sm:text-base font-medium py-3 px-4 sm:py-3.5 sm:px-6 disabled:bg-opacity-90 bg-slate-900 hover:bg-slate-800 text-slate-50 shadow-xl"
                            style="min-width: 150px"
                            @click="submit"
                        >
                            Gửi tới chúng tôi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import _cloneDeep from 'lodash/cloneDeep';
    import { validEmail } from '@/utils/form';
    import { mapState } from 'vuex';

    const defaultForm = {
        fullname: '',
        email: '',
        content: '',
    };
    export default {
        data() {
            return {
                form: this.user ? _cloneDeep(this.user) : _cloneDeep(defaultForm),
                rules: {
                    email: [{ validator: validEmail, message: 'Vui lòng nhập email của bạn', trigger: 'change' }],
                    phone_number: [{ message: 'Vui lòng nhập số điện thoại của bạn', trigger: 'change' }],
                    content: [{ required: true, message: 'Vui lòng nhập lời nhắn', trigger: 'change' }],
                    fullname: [{ required: true, message: 'Vui lòng nhập tên của bạn', trigger: 'change' }],
                },
            };
        },

        computed: {
            ...mapState('settings', ['setting']),
        },

        methods: {
            submit() {
                this.$refs.contactForm.validate(async (valid) => {
                    if (valid) {
                        await this.$api.settings.createContact(this.form);
                        this.$message.success('Gửi thành công');
                        this.form = _cloneDeep(defaultForm);
                    } else {
                        this.$message.error('Phản hồi thất bại');
                        return false;
                    }
                });
            },
        },
    };
</script>
