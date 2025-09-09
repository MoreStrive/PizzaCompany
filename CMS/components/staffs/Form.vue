<template>
    <a-form-model ref="form" :model="form" :rules="rules">
        <div class="grid grid-cols-1 gap-6">
            <div class="card p-4 col-span-12 xl:col-span-12 rounded-md bg-white">
                <p class="font-semibold text-xl">
                    1. Thông tin cơ bản
                </p>
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
                <div class="grid grid-cols-1 gap-4 items-center">
                    <div class="grid grid-cols-3 gap-4 items-center">
                        <a-form-model-item prop="username" label="Tên đăng nhập">
                            <a-input v-model="form.username" placeholder="Tên đăng nhập của người dùng" />
                        </a-form-model-item>
                        <a-form-model-item v-if="!staff" prop="password" label="Mật khẩu">
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
                                <a-select-option v-for="_gender in STAFF_GENDER_OPTIONS" :key="_gender.value" :value="_gender.value">
                                    {{ _gender.label }}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item has-feedback label="Trạng thái hoạt động" prop="gender">
                            <a-select v-model="form.status">
                                <a-select-option v-for="_status in STAFF_STATUS_OPTIONS" :key="_status.value" :value="_status.value">
                                    {{ _status.label }}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item has-feedback label="Sinh nhật" prop="date_of_birth">
                            <a-date-picker
                                v-model="form.date_of_birth"
                                format="DD-MM-YYYY"
                                value-format="YYYY-MM-DD"
                                placeholder="Chọn sinh nhật của nhân viên"
                                class="w-full"
                            />
                        </a-form-model-item>
                        <a-form-model-item has-feedback label="Ngày tham gia" prop="join_date">
                            <a-date-picker
                                v-model="form.join_date"
                                format="DD-MM-YYYY"
                                value-format="YYYY-MM-DD"
                                placeholder="Chọn ngày tham gia của nhân viên"
                                class="w-full"
                            />
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
            <div v-if="$permission.Admin()" class="card p-4 col-span-12 xl:col-span-12 rounded-md bg-white">
                <p class="font-semibold text-xl">
                    2. Quyền lợi
                </p>
                <div class="grid grid-cols-3 gap-4">
                    <a-form-model-item
                        prop="role"
                        label="Chức vụ"
                    >
                        <a-select v-model="form.role">
                            <a-select-option v-for="_role in STAFF_ROLE_OPTIONS" :key="_role.value" :value="_role.value">
                                {{ _role.label }}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item
                        prop="salary"
                        label="Mức lương"
                    >
                        <a-input v-model="form.salary" placeholder="Nhập mức lương của nhân viên" />
                    </a-form-model-item>
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
        validNumberString,
    } from '@/utils/form';
    import _cloneDeep from 'lodash/cloneDeep';
    import { STAFF_GENDER_OPTIONS } from '@/constants/staffs/gender';
    import { STAFF_STATUS, STAFF_STATUS_OPTIONS } from '@/constants/staffs/status';
    import { STAFF_ROLE_OPTIONS } from '@/constants/staffs/role';

    const defaultForm = {
        username: '',
        email: '',
        password: '',
        phone_number: '',
        full_name: '',
        avatar: '',
        gender: '',
        date_of_birth: '',
        role: '',
        join_date: '',
        salary: 0,
        address: '',
    };
    export default {
        components: {
            // SelectRemote,
        },

        props: {
            loading: {
                type: Boolean,
                default: false,
            },
            staff: {
                type: Object,
                default: () => {},
            },
        },

        data() {
            return {
                STAFF_STATUS,
                STAFF_STATUS_OPTIONS,
                STAFF_GENDER_OPTIONS,
                STAFF_ROLE_OPTIONS,
                form: this.staff ? _cloneDeep(this.staff) : _cloneDeep(defaultForm),
                fileAvatar: null,
                rules: {
                    staffname: [{ required: true, validator: usernameValidator, trigger: 'blur' }],
                    password: [{ required: true, validator: passwordValidtor, trigger: ['blur'] }],
                    full_name: [{ required: true, message: 'Vui lòng nhập họ và tên người dùng', trigger: 'blur' }],
                    role: [{ required: true, message: 'Vui lòng không để trống trường này', trigger: 'blur' }],
                    email: [{
                        required: true, validator: validEmail, message: 'Vui lòng nhập đúng định dạng email', trigger: ['change', 'blur'],
                    }],
                    phone_number: [{
                        required: true, validator: phoneValidator, message: 'Vui lòng nhập đúng định dạng số điện thoại', trigger: ['change', 'blur'],
                    }],
                    join_date: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    date_of_birth: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    salary: [{
                        required: true, message: 'Vui lòng không để trống trường này', trigger: ['blur'],
                    }, {
                        validator: validNumberString, trigger: ['change'],
                    }],
                },
            };
        },

        watch: {
            staff: {
                handler() {
                    this.form = this.staff ? _cloneDeep(this.staff) : _cloneDeep(defaultForm);
                    this.$forceUpdate();
                },
                deep: true,
                immediate: true,
            },
        },

        mounted() {
            if (this.staff) {
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
