<template>
    <a-modal
        v-model="visible"
        width="1000px"
        destroy-on-close
        :title="_isEmpty(discount) ? 'Thêm mã giảm giá' : 'Sửa mã giảm giá'"
    >
        <a-form-model
            ref="form"
            :model="form"
            :rules="rules"
            layout="vertical"
            :colon="false"
        >
            <div class="grid grid-cols-2 gap-5">
                <div>
                    <div class="flex items-center gap-x-8 mb-6">
                        <img
                            v-if="form.thumbnail"
                            :src="form.thumbnail"
                            onerror="this.src='/images/default-avatar.png'"
                            alt=""
                            class="w-60 h-40 rounded-sm object-cover"
                        >
                        <div v-else class="w-60 h-40 rounded-sm border-dashed border border-gray-400 flex justify-center items-center">
                            <span><i class="fas fa-plus" /></span>
                        </div>
                        <a-upload
                            :show-upload-list="false"
                            action=""
                            :transform-file="handlerThumbnail"
                        >
                            <div class="flex gap-x-2">
                                <img src="/images/upload.svg" alt="avatar">
                                Tải lên
                            </div>
                        </a-upload>
                    </div>
                    <a-form-model-item
                        prop="title"
                        label="Tên mã giảm giá"
                    >
                        <a-input
                            v-model="form.title"
                            placeholder="Nhập tên mã giảm giá"
                        />
                    </a-form-model-item>
                    <div class="grid grid-cols-2 gap-3 mt-2">
                        <a-form-model-item
                            prop="code"
                            label="Mã kích hoạt"
                        >
                            <a-input
                                v-model="form.code"
                                placeholder="Nhập mã kích hoạt"
                            />
                        </a-form-model-item>
                        <a-form-model-item
                            prop="discount_type"
                            label="Loại giảm giá"
                        >
                            <a-select v-model="form.discount_type">
                                <a-select-option v-for="_discount in DISCOUNT_OPTIONS" :key="_discount.value" :value="_discount.value">
                                    {{ _discount.label }}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item
                            prop="discount_value"
                            label="Giá trị (Lưu ý loại giảm giá)"
                        >
                            <a-input
                                v-model="form.discount_value"
                                placeholder="Nhập giá trị giảm"
                            />
                        </a-form-model-item>
                        <a-form-model-item
                            prop="count"
                            label="Số lượng mã giảm giá"
                        >
                            <a-input
                                v-model="form.count"
                                placeholder="Nhập số lượng mã giảm giá"
                            />
                        </a-form-model-item>
                    </div>
                </div>
                <div>
                    <a-form-model-item label="Số lần dùng tối đa cho 1 cá nhân" prop="limit_on_user">
                        <a-input
                            v-model="form.limit_on_user"
                            placeholder="Nhập số lần dùng tối đa cho 1 cá nhân"
                        />
                    </a-form-model-item>
                    <a-form-model-item label="Mô tả" prop="description">
                        <a-textarea
                            v-model="form.content"
                            placeholder="Nhập mô tả"
                            :auto-size="{ minRows: 5, maxRows: 8 }"
                        />
                    </a-form-model-item>
                    <div class="grid grid-cols-2 gap-5">
                        <a-form-model-item label="Ngày bắt đầu" prop="start_date" class="!w-full">
                            <a-date-picker v-model="form.start_date" value-format="YYYY-MM-DD" placeholder="Chọn ngày bắt đầu" />
                        </a-form-model-item>
                        <a-form-model-item label="Ngày hết hạn" prop="expiration_date" class="!w-full">
                            <a-date-picker v-model="form.expiration_date" value-format="YYYY-MM-DD" placeholder="Chọn ngày hết hạn" />
                        </a-form-model-item>
                    </div>
                    <a-form-model-item label="Trạng thái hoạt động" prop="gender">
                        <a-select v-model="form.status">
                            <a-select-option v-for="_status in STATUS_OPTIONS" :key="_status.value" :value="_status.value">
                                {{ _status.label }}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                </div>
            </div>
        </a-form-model>
        <div slot="footer" class="flex justify-center items-center gap-2 mt-3">
            <a-button class="w-28" @click="close">
                Cancel
            </a-button>
            <a-button
                :loading="loading"
                class="px-2"
                type="primary"
                @click="submit"
            >
                {{ _isEmpty(discount) ? "Thêm mới" : "Cập nhật" }}
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    import {
        convertToFormData,
    } from '@/utils/form';
    import _isEmpty from 'lodash/isEmpty';
    import _cloneDeep from 'lodash/cloneDeep';
    import { DISCOUNT, DISCOUNT_OPTIONS } from '@/constants/discount/discount';
    import { CONDITION, CONDITION_OPTIONS } from '@/constants/discount/condition';
    import { STATUS, STATUS_OPTIONS } from '@/constants/discount/status';

    const defaultForm = {
        title: '',
        code: '',
        count: 1,
        thumbnail: '',
        content: '',
        condition: CONDITION.ALL,
        value_condition: null,
        discount_type: DISCOUNT.PERCENT,
        discount_value: '',
        limit_on_user: 0,
        status: 'active',
        start_date: '',
        expiration_date: '',
    };

    export default {
        data() {
            const checkCount = (rule, value, callback) => {
                if (value <= 0) {
                    callback(new Error('Số lượng cần lớn hơn hoặc bằng 1'));
                } else {
                    callback();
                }
            };
            return {
                DISCOUNT,
                DISCOUNT_OPTIONS,
                CONDITION,
                CONDITION_OPTIONS,
                STATUS,
                STATUS_OPTIONS,
                visible: false,
                loading: false,
                discount: null,
                fileThumbnail: null,
                rules: {
                    title: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    code: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    condition: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    value_condition: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    limit_on_user: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    start_date: [{ required: true, message: 'Không được để trống trường này', trigger: 'change' }],
                    expiration_date: [{ required: true, message: 'Không được để trống trường này', trigger: 'change' }],
                    discount_value: [{ required: true, message: 'Không được để trống trường này', trigger: 'change' }],
                    discount_type: [{ required: true, message: 'Không được để trống trường này', trigger: 'change' }],
                    count: [{ required: true, message: 'Không được để trống trường này', trigger: 'change' }, {
                        validator: checkCount, trigger: 'blur',
                    }],
                },
                form: this.discount ? _cloneDeep(this.discount) : _cloneDeep(defaultForm),
            };
        },

        watch: {
            discount() {
                this.form = this.discount ? _cloneDeep(this.discount) : _cloneDeep(defaultForm);
            },
            'form.count': {
                handler() {
                    if (!this.form.count) this.form.count = 0;
                },
            },
        },

        methods: {
            _isEmpty,
            open(discount) {
                this.discount = discount;
                this.visible = true;
            },

            close() {
                this.visible = false;
            },

            handlerThumbnail(file) {
                this.fileThumbnail = file;
                this.form.thumbnail = URL.createObjectURL(file);
            },

            async submit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        try {
                            this.loading = true;
                            if (this.fileThumbnail) {
                                const { data: { fileAttributes } } = await this.$api.uploaders.uploadFiles(convertToFormData({
                                    files: this.fileThumbnail,
                                }));
                                this.form = { ...this.form, thumbnail: fileAttributes[0]?.source };
                            }
                            if (!this.discount) {
                                await this.$api.discounts.create(this.form);
                                this.$message.success('Tạo mã giảm giá thành công');
                            } else {
                                await this.$api.discounts.update(this.discount.id, this.form);
                                this.$message.success('Cập nhật mã giảm giá thành công');
                            }
                            this.close();
                            await this.$nuxt.refresh();
                        } catch (error) {
                            this.$handleError(error);
                        } finally {
                            this.loading = false;
                        }
                    }
                });
            },
        },
    };
</script>
