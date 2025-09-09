<template>
    <a-form-model ref="form" :model="form" :rules="rules">
        <div class="grid grid-cols-1 gap-6">
            <div>
                <div class="flex justify-between">
                    <div class="flex items-center gap-x-8 mb-6">
                        <img
                            v-if="form.avatar"
                            :src="form.avatar"
                            onerror="this.src='/images/default-avatar.png'"
                            alt=""
                            class="w-32 h-32 rounded-full object-cover"
                        >
                        <div v-else class="w-32 h-32 rounded-full border-dashed border border-gray-400 flex justify-center items-center">
                            <span><i class="fas fa-plus" /></span>
                        </div>
                        <a-upload
                            v-if="isEdit"
                            :show-upload-list="false"
                            action=""
                            :transform-file="handlerAvatar"
                        >
                            <div class="flex gap-x-2">
                                <img src="/images/upload.svg" alt="avatar">
                                Tải lên
                            </div>
                        </a-upload>
                    </div>
                    <div v-if="user" class="">
                        <div class="text-center">
                            <div class="w-[180px] h-auto">
                                <template v-if="user.customer_class === CLASS.BRONZE">
                                    <img class="w-full h-full object-contain" src="/images/ranks/Bronze.webp" alt="">
                                </template>
                                <template v-else-if="user.customer_class === CLASS.SILVER">
                                    <img class="w-full h-full object-contain" src="/images/ranks/Silver.webp" alt="">
                                </template>
                                <template v-else-if="user.customer_class === CLASS.GOLD">
                                    <img class="w-full h-full object-contain" src="/images/ranks/Gold.webp" alt="">
                                </template>
                                <template v-else-if="user.customer_class === CLASS.DIAMOND">
                                    <img class="w-full h-full object-contain" src="/images/ranks/Diamond.webp" alt="">
                                </template>
                            </div>
                            <div>
                                <h4>{{ CLASS_LABEL[user.customer_class] }}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-5 gap-8 mt-10">
                    <div class="grid grid-cols-2 col-span-3 gap-4 items-center">
                        <a-form-model-item prop="full_name" label="Họ và tên">
                            <a-input v-model="form.full_name" :disabled="!isEdit" placeholder="Nhập họ và tên người dùng" />
                        </a-form-model-item>
                        <a-form-model-item has-feedback label="Số điện thoại" prop="phone_number">
                            <a-input v-model="form.phone_number" :disabled="!isEdit" placeholder="Nhập số điện thoại" />
                        </a-form-model-item>
                        <a-form-model-item has-feedback label="Giới tính" prop="gender">
                            <a-select v-model="form.gender" :disabled="!isEdit">
                                <a-select-option v-for="_gender in USER_GENDER_OPTIONS" :key="_gender.value" :value="_gender.value">
                                    {{ _gender.label }}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item
                            prop="address"
                            label="Địa chỉ cụ thể"
                            class="col-span-2"
                        >
                            <a-textarea
                                v-model="form.address"
                                :disabled="!isEdit"
                                :auto-size="{ minRows: 3, maxRows: 3 }"
                                placeholder="Nhập địa chỉ cụ thể"
                            />
                        </a-form-model-item>
                    </div>
                    <div class="col-span-2">
                        <div class="rounded-md bg-white mt-4">
                            <div class="">
                                <h3 class="text-right">
                                    Số tiền đã chi tiêu:
                                    <span class="block text-2xl">{{ form.accumulated_point | currencyFormat }}</span>
                                </h3>
                            </div>
                            <div class="mt-4 text-right">
                                <p class="mb-1 italic">
                                    Dựa trên số tiền chi tiêu
                                </p>
                                <p class="mb-1 italic">
                                    <span class="text-danger-100">*</span>Tạo tài khoản: Hạng thành viên
                                </p>
                                <p class="mb-1 italic">
                                    <span class="text-danger-100">*</span>Trên 2 triệu đồng: Hạng Bạc <b>(giảm 1%)</b>
                                </p>
                                <p class="mb-1 italic">
                                    <span class="text-danger-100">*</span>Trên 5 triệu đồng: Hạng Vàng <b>(giảm 2%)</b>
                                </p>
                                <p class="mb-1 italic">
                                    <span class="text-danger-100">*</span>Trên 10 triệu đồng: Hạng Kim cương <b>(giảm 3%)</b>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <template v-if="isEdit">
                <div class="flex items-center gap-2">
                    <a-button @click="isEdit = false">
                        Hủy bỏ
                    </a-button>
                    <a-button
                        :loading="loading"
                        type="primary"
                        @click="submit"
                    >
                        Cập nhật
                    </a-button>
                </div>
            </template>
            <template v-else>
                <div>
                    <a-button
                        :loading="loading"
                        @click="isEdit = true"
                    >
                        Thay đổi thông tin
                    </a-button>
                </div>
            </template>
        </div>
    </a-form-model>
</template>

<script>
    import moment from 'moment';
    import {
        convertToFormData,
        phoneValidator,
    } from '@/utils/form';
    import _cloneDeep from 'lodash/cloneDeep';
    import { USER_GENDER_OPTIONS } from '@/constants/user/gender';
    import { CLASS_OPTIONS, CLASS } from '@/constants/user/class';
    import { mapDataFromOptions } from '@/utils/data';

    const defaultForm = {
        full_name: '',
        phone_number: '',
        password: '',
        avatar: '',
        dateOfBirth: '',
        acceptPolicy: '',
        status: '',
        gender: '',
        address: '',
        accumulated_point: '',
    };
    export default {
        props: {
            loading: {
                type: Boolean,
                default: false,
            },
            user: {
                type: Object,
                default: () => {},
            },
        },

        data() {
            return {
                CLASS,
                USER_GENDER_OPTIONS,
                isEdit: false,
                form: this.user ? _cloneDeep(this.user) : _cloneDeep(defaultForm),
                fileAvatar: null,
                rules: {
                    full_name: [{ required: true, message: 'Vui lòng nhập họ và tên người dùng', trigger: 'blur' }],
                    phone_number: [{
                        required: true, validator: phoneValidator, message: 'Vui lòng nhập đúng định dạng số điện thoại', trigger: ['change', 'blur'],
                    }],
                    gender: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    address: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                },
            };
        },

        computed: {
            CLASS_LABEL() {
                return mapDataFromOptions(CLASS_OPTIONS, 'value', 'label');
            },
        },

        watch: {
            user: {
                handler() {
                    this.form = this.user ? _cloneDeep(this.user) : _cloneDeep(defaultForm);
                    this.$forceUpdate();
                },
                deep: true,
                immediate: true,
            },
            isEdit() {
                if (!this.isEdit) {
                    this.form = _cloneDeep(this.user);
                }
            },
        },

        methods: {
            moment,
            convertToFormData,

            async submit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        if (this.fileAvatar) {
                            const { data: { fileAttributes } } = await this.$api.uploaders.uploadFiles(convertToFormData({
                                files: this.fileAvatar,
                            }));
                            this.form = { ...this.form, avatar: fileAttributes[0]?.source };
                        }
                        this.$emit('submit', {
                            ...this.form,
                        });
                        this.isEdit = false;
                    }
                });
            },

            handlerAvatar(file) {
                this.fileAvatar = file;
                this.form.avatar = URL.createObjectURL(file);
            },
        },
    };
</script>
