<template>
    <a-modal
        v-model="visible"
        width="1000px"
        destroy-on-close
        :title="_isEmpty(material) ? 'Thêm nguyên liệu' : 'Sửa nguyên liệu'"
    >
        <a-form-model
            ref="form"
            :model="form"
            :rules="rules"
            layout="vertical"
            :colon="false"
        >
            <div class="grid grid-cols-2 gap-6">
                <div>
                    <div class="flex flex-col items-center gap-y-8 mb-6">
                        <img
                            v-if="form.thumbnail"
                            :src="form.thumbnail"
                            onerror="this.src='/images/default-avatar.png'"
                            alt=""
                            class="w-full h-52 rounded-sm object-cover"
                        >
                        <div v-else class="w-full h-52 rounded-sm border-dashed border border-gray-400 flex justify-center items-center">
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
                        label="Tên nguyên liệu"
                    >
                        <a-input
                            v-model="form.title"
                            :disabled="!$permission.Admin()"
                            placeholder="Nhập tên nguyên liệu"
                        />
                    </a-form-model-item>
                </div>
                <div>
                    <div class="grid grid-cols-2 gap-4">
                        <a-form-model-item
                            prop="code"
                            label="Mã nguyên liệu"
                        >
                            <a-input
                                v-model="form.code"
                                placeholder="Nhập mã nguyên liệu"
                                :disabled="!_isEmpty(material)"
                            />
                        </a-form-model-item>
                        <a-form-model-item label="Ngày hết hạn" prop="expiration_date" class="!w-full">
                            <a-date-picker v-model="form.expiration_date" :disabled="!$permission.Admin()" placeholder="Chọn ngày bắt đầu" />
                        </a-form-model-item>
                        <a-form-model-item
                            prop="quantity"
                            label="Số lượng"
                        >
                            <a-input
                                v-model="form.quantity"
                                placeholder="Nhập số lượng"
                            />
                        </a-form-model-item>
                        <a-form-model-item
                            prop="unit"
                            label="Đơn vị"
                        >
                            <a-select v-model="form.unit" :disabled="!_isEmpty(material)">
                                <a-select-option v-for="_material in UNIT_OPTIONS" :key="_material.value" :value="_material.value">
                                    {{ _material.label }}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </div>
                    <a-form-model-item
                        v-if="material"
                        prop="content"
                        label="Nội dung (chỉnh sửa, lấy nguyên liệu, nhập hàng,...)"
                    >
                        <a-textarea
                            v-model="form.content"
                            placeholder="Nhập nội dung"
                            :auto-size="{ minRows: 3, maxRows: 3 }"
                        />
                    </a-form-model-item>
                </div>
            </div>
        </a-form-model>
        <div slot="footer" class="flex justify-center items-center gap-2 mt-3">
            <a-button class="w-28" @click="close">
                Hủy bỏ
            </a-button>
            <a-button
                :loading="loading"
                class="px-2"
                type="primary"
                @click="submit"
            >
                {{ _isEmpty(material) ? "Thêm mới" : "Cập nhật" }}
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
    import { UNIT, UNIT_OPTIONS } from '@/constants/materials/unit';

    const defaultForm = {
        title: '',
        code: '',
        quantity: 0,
        thumbnail: '',
        unit: UNIT.GAM,
        expiration_date: '',
        content: '',
    };

    export default {
        data() {
            return {
                UNIT,
                UNIT_OPTIONS,
                visible: false,
                loading: false,
                material: null,
                fileThumbnail: null,
                initQuantity: null,
                form: this.material ? _cloneDeep(this.material) : _cloneDeep(defaultForm),
                rules: {
                    title: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    code: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    quantity: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    thumbnail: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    unit: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    expiration_date: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                },
            };
        },

        watch: {
            material() {
                this.form = this.material ? _cloneDeep(this.material) : _cloneDeep(defaultForm);
                this.initQuantity = this.material && this.material.quantity;
            },
        },

        methods: {
            _isEmpty,
            open(material) {
                this.material = material;
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
                            if (!this.material) {
                                await this.$api.materials.create(this.form);
                                this.$message.success('Tạo nguyên liệu thành công');
                            } else {
                                await this.$api.materials.update(this.material.id, this.form);
                                if (this.initQuantity !== this.form.quantity) {
                                    await this.$api.materialHistories.create({
                                        material_id: this.material.id,
                                        staff_id: this.$auth.user.id,
                                        content: this.form.content,
                                        unit: this.form.unit,
                                        quantity: this.form.quantity - this.initQuantity,
                                    });
                                }
                            }
                            await this.$nuxt.refresh();
                            this.$message.success('Cập nhật nguyên liệu thành công');
                            this.close();
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
