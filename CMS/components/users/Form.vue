<template>
    <a-form-model ref="form" :model="form" :rules="rules">
        <div class="grid grid-cols-1 gap-6">
            <div class="card p-4 col-span-12 xl:col-span-12 rounded-md bg-white">
                <p class="font-semibold text-xl">
                    1. Thông tin cơ bản <span class="italic font-light ml-3 text-sm">{{ form.is_verify ? 'Đã xác thực' : 'Chưa xác thực' }}</span>
                </p>
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
                    <div v-if="user" class="mr-20">
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
                <div class="grid grid-cols-1 gap-4 items-center">
                    <div class="grid grid-cols-3 gap-4 items-center">
                        <a-form-model-item prop="username" label="Tên đăng nhập">
                            <a-input v-model="form.username" placeholder="Tên đăng nhập của người dùng" />
                        </a-form-model-item>
                        <a-form-model-item v-if="!user" prop="password" label="Mật khẩu">
                            <a-input v-model="form.password" placeholder="Mật khẩu" />
                        </a-form-model-item>
                        <a-form-model-item prop="full_name" label="Họ và tên">
                            <a-input v-model="form.full_name" placeholder="Nhập họ và tên người dùng" />
                        </a-form-model-item>
                    </div>
                    <div class="grid grid-cols-3 gap-4">
                        <a-form-model-item has-feedback label="Số điện thoại" prop="phone_number">
                            <a-input v-model="form.phone_number" placeholder="Nhập số điện thoại" />
                        </a-form-model-item>
                        <a-form-model-item has-feedback label="Email" prop="email">
                            <a-input v-model="form.email" placeholder="Nhập Email nhân viên" />
                        </a-form-model-item>
                        <a-form-model-item has-feedback label="Giới tính" prop="gender">
                            <a-select v-model="form.gender">
                                <a-select-option v-for="_gender in USER_GENDER_OPTIONS" :key="_gender.value" :value="_gender.value">
                                    {{ _gender.label }}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item has-feedback label="Trạng thái hoạt động" prop="gender">
                            <a-select v-model="form.status">
                                <a-select-option v-for="_status in USER_STATUS_OPTIONS" :key="_status.value" :value="_status.value">
                                    {{ _status.label }}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item
                            prop="address"
                            label="Địa chỉ cụ thể"
                        >
                            <a-textarea v-model="form.address" :auto-size="{ minRows: 3, maxRows: 3 }" placeholder="Nhập địa chỉ cụ thể" />
                        </a-form-model-item>
                    </div>
                </div>
            </div>
            <div v-if="user" class="card p-4 col-span-12 xl:col-span-12 rounded-md bg-white">
                <p class="font-semibold text-xl">
                    2. Quyền lợi
                </p>
                <div class="grid grid-cols-3 gap-4">
                    <a-form-model-item
                        prop="role"
                        label="Số tiền đã chi tiêu"
                    >
                        <a-input v-model="form.accumulated_point" placeholder="Số tiền đã chi tiêu" disabled />
                    </a-form-model-item>
                </div>
                <div class="mt-4">
                    <p class="mb-1 italic">
                        <span class="text-danger-100">*</span>Tạo tài khoản: Hạng thành viên
                    </p>
                    <p class="mb-1 italic">
                        <span class="text-danger-100">*</span>Chi tiêu trên 2 triệu đồng: Hạng Bạc
                    </p>
                    <p class="mb-1 italic">
                        <span class="text-danger-100">*</span>Chi tiêu trên 5 triệu đồng: Hạng Vàng
                    </p>
                    <p class="mb-1 italic">
                        <span class="text-danger-100">*</span>Chi tiêu trên 10 triệu đồng: Hạng Kim cương
                    </p>
                </div>
            </div>
        </div>
    </a-form-model>
</template>

<script>
    import moment from 'moment';
    import {
        convertToFormData,
        validEmail,
        phoneValidator,
        passwordValidtor,
        usernameValidator,
    } from '@/utils/form';
    import { mapDataFromOptions } from '@/utils/data';
    import _cloneDeep from 'lodash/cloneDeep';
    import { USER_GENDER_OPTIONS } from '@/constants/user/gender';
    import { USER_STATUS, USER_STATUS_OPTIONS } from '@/constants/user/status';
    import { CLASS_OPTIONS, CLASS } from '@/constants/user/class';

    const defaultForm = {
        username: '',
        email: '',
        password: '',
        phone_number: '',
        full_name: '',
        avatar: '',
        gender: '',
        address: '',
        accumulated_point: 0,
        customer_class: 'Bronze',
        is_verify: false,
        status: '',
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
                USER_STATUS,
                USER_STATUS_OPTIONS,
                USER_GENDER_OPTIONS,
                CLASS_OPTIONS,
                CLASS,
                form: this.user ? _cloneDeep(this.user) : _cloneDeep(defaultForm),
                fileAvatar: null,
                rules: {
                    username: [{ required: true, validator: usernameValidator, trigger: 'blur' }],
                    password: [{ required: true, validator: passwordValidtor, trigger: ['blur'] }],
                    full_name: [{ required: true, message: 'Vui lòng nhập họ và tên người dùng', trigger: 'blur' }],
                    email: [{
                        required: true, validator: validEmail, message: 'Vui lòng nhập đúng định dạng email', trigger: ['change', 'blur'],
                    }],
                    phone_number: [{
                        required: true, validator: phoneValidator, message: 'Vui lòng nhập đúng định dạng số điện thoại', trigger: ['change', 'blur'],
                    }],
                    gender: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    status: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    address: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    customer_class: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
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
        },

        mounted() {
            if (this.user) {
                this.$forceUpdate();
            }
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
