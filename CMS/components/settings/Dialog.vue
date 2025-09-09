<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        :title="_isEmpty(feedback) ? 'Tạo Banner' : 'Chỉnh sửa Banner'"
    >
        <a-form-model
            ref="form"
            :model="form"
            layout="vertical"
            :colon="false"
        >
            <div class="grid grid-cols-10 gap-y-4">
                <a-form-model-item label="Hình ảnh" prop="image" class="col-span-3">
                    <div class="flex flex-col items-center gap-y-8 mb-6 w-[100px]">
                        <img
                            v-if="form.thumbnail"
                            :src="form.thumbnail"
                            onerror="this.src='/images/default-avatar.png'"
                            alt=""
                            class="w-full h-[200px] rounded-md object-cover"
                        >
                        <div v-else class="w-[100px] h-[100px] rounded-md border-dashed border border-gray-400 flex justify-center items-center">
                            <span><i class="fas fa-plus" /></span>
                        </div>
                        <input
                            id="thumbnailImage"
                            class="!hidden"
                            type="file"
                            accept="image/jpeg, image/png"
                            @change="previewThumbnail"
                        >
                        <div class="flex gap-x-2">
                            <div class="flex items-center w-fit px-2 py-1 rounded-lg border cursor-pointer border-[#0c4ea4] hover:bg-[#0c4ea4] hover:text-[#fff] transition duration-150 ease-out hover:ease-in border-[#d3d3d3]" @click="openSelectFile">
                                <p class="mb-0 px-3 text-sm text-black">
                                    {{ _isEmpty(feedback) ? 'Upload' : 'Thay đổi' }}
                                </p>
                            </div>
                        </div>
                    </div>
                </a-form-model-item>
                <a-form-model-item label="Nội dung phản hồi" prop="content" class="col-span-7">
                    <a-textarea
                        v-model="form.content"
                        placeholder="Nhập mô tả"
                        :auto-size="{ minRows: 5, maxRows: 8 }"
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
                class="w-28"
                type="primary"
                @click="submit"
            >
                {{ _isEmpty(feedback) ? "Tạo feedback" : "Gửi" }}
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    import _isEmpty from 'lodash/isEmpty';

    export default {
        components: {
        },
        props: {
        },
        data() {
            return {
                previewVisible: false,
                previewImage: '',
                fileList: [],
                visible: false,
                loading: false,
                room: null,
                form: {
                    content: '',
                    thumbnail: '',
                },
                fileName: null,
                feedback: null,
            };
        },
        methods: {
            _isEmpty,
            open(feedback) {
                this.feedback = feedback;
                this.form = {
                    description: feedback ? feedback.description : '',
                    thumbnail: feedback ? feedback.thumbnail : '',
                };
                this.visible = true;
            },

            close() {
                this.visible = false;
            },
            openSelectFile() {
                document.querySelector('#thumbnailImage').click();
            },

            previewThumbnail() {
                const imageSelect = document.querySelector('#thumbnailImage').files[0];
                this.fileName = imageSelect.name;
                this.form.thumbnail = URL.createObjectURL(imageSelect);
            },

            async handlerThumbnail() {
                const formData = new FormData();
                const imageSelected = document.querySelector('#thumbnailImage').files[0];
                formData.append('image', imageSelected);
                await this.$axios.post('https://casota.herokuapp.com/api/uploads', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
                    .then((res) => { this.form.thumbnail = res.data.data.fileAttributes[0].source; })
                    .catch((err) => console.log(err))
                    .finally(() => false);
            },

            async submit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        try {
                            this.loading = true;
                            await this.handlerThumbnail();
                            await this.$api.feedbacks.create({ ...this.form, status: 'active' });
                            this.$message.success('Thêm Phản hồi thành công');
                            this.close();
                            await this.$store.dispatch('feedbacks/fetchAll', { ...this.$route.query, createdBy: 'admin' });
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
