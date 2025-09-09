<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        :title="_isEmpty(category) ? 'Tạo danh mục' : 'Chỉnh sửa danh mục'"
    >
        <a-form-model
            ref="form"
            :model="form"
            layout="vertical"
            :colon="false"
            :rules="rules"
        >
            <div class="grid grid-cols-1">
                <a-form-model-item label="Hình ảnh" prop="thumbnail">
                    <div class="flex flex-col items-center w-full h-[200px] border-[2px] border-dashed border-gray-20 overflow-hidden rounded-md">
                        <img
                            v-if="form.thumbnail"
                            :src="form.thumbnail"
                            onerror="this.src='/images/default.jpg'"
                            alt=""
                            class="w-full h-[200px] rounded-md object-cover"
                        >
                        <a-empty v-else class="pt-10" :description="false" />
                    </div>
                    <a-upload
                        :show-upload-list="false"
                        action=""
                        class="mx-auto block text-center"
                        :transform-file="handlerThumbnail"
                    >
                        <div class="flex gap-x-2 mt-4">
                            <img src="/images/upload.svg" alt="avatar">
                            {{ _isEmpty(category) ? "Tải lên" : "Thay đổi" }}
                        </div>
                    </a-upload>
                </a-form-model-item>
                <a-form-model-item label="Tên danh mục" prop="title">
                    <a-input
                        v-model="form.title"
                        placeholder="Nhập Tên danh mục"
                    />
                </a-form-model-item>
                <a-form-model-item label="Vị trí hiển thị" prop="order">
                    <a-input
                        v-model="form.order"
                        placeholder="Nhập vị trí hiển thị"
                    />
                </a-form-model-item>
            </div>
        </a-form-model>
        <div slot="footer" class="flex justify-center items-center gap-2">
            <a-button class="w-28" @click="close">
                Hủy bỏ
            </a-button>
            <a-button
                :loading="loading"
                class="px-2"
                type="primary"
                @click="submit"
            >
                {{ _isEmpty(category) ? "Tạo mới" : "Cập nhật" }}
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    import { mapState } from 'vuex';
    import _isEmpty from 'lodash/isEmpty';
    import _cloneDeep from 'lodash/cloneDeep';
    import {
        convertToFormData,
        slugify,
    } from '@/utils/form';
    import { TYPE_OPTIONS, TYPE } from '@/constants/categories/type';

    const defaulForm = {
        title: '',
        thumbnail: '',
        type: TYPE.PRODUCT,
        order: undefined,
    };

    export default {
        props: {
        },

        data() {
            return {
                TYPE,
                TYPE_OPTIONS,
                visible: false,
                loading: false,
                form: null,
                category: null,
                thumbnailFile: null,
                rules: {
                    title: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    order: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                },
            };
        },

        computed: {
            ...mapState('categories', ['categories']),
        },

        watch: {
            category: {
                handler() {
                    this.form = this.category ? _cloneDeep(this.category) : _cloneDeep({ ...defaulForm });
                },
                deep: true,
                immediate: true,
            },
        },

        methods: {
            _isEmpty,
            convertToFormData,

            open(category) {
                this.category = category;
                this.visible = true;
            },

            close() {
                this.visible = false;
            },

            empty() {
                this.category = null;
            },

            handlerThumbnail(file) {
                this.thumbnailFile = file;
                this.form.thumbnail = URL.createObjectURL(file);
            },

            async create(form) {
                try {
                    await this.$api.categories.create({ ...form, slug: slugify(this.form.title) });
                } catch (error) {
                    this.$handleError(error);
                }
            },

            async update(form) {
                try {
                    await this.$api.categories.update(form.id, { ...form, slug: slugify(this.form.title) });
                } catch (error) {
                    this.$handleError(error);
                }
            },

            async submit() {
                this.$refs.form.validate(async (valid) => {
                    if (!this.form.thumbnail) {
                        this.$message.error('Hình ảnh là bắt buộc');
                        return;
                    }
                    if (valid) {
                        try {
                            this.loading = true;
                            if (this.thumbnailFile) {
                                const { data: { fileAttributes } } = await this.$api.uploaders.uploadFiles(convertToFormData({
                                    files: this.thumbnailFile,
                                }));
                                this.form = { ...this.form, thumbnail: fileAttributes[0]?.source };
                            }
                            if (!this.category) {
                                await this.create({ ...this.form, type: TYPE.PRODUCT });
                                this.$message.success('Thêm mới danh mục thành công');
                            } else {
                                await this.update({ ...this.form, type: TYPE.PRODUCT });
                                this.$message.success('Cập nhật thông tin danh mục thành công');
                            }
                            this.empty();
                            this.$nuxt.refresh();
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
