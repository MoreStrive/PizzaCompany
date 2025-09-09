<template>
    <div>
        <div class="card space-y-4">
            <div class="flex items-center justify-between">
                <div class="flex gap-2 items-center">
                    <PageHeader text="Cập nhật Combo" />
                    <a-tag :color="STATUS_COLOR[combo.status]">
                        {{ STATUS_LABEL[combo.status] }}
                    </a-tag>
                </div>
                <div class="flex gap-2 items-center">
                    <a-button :loading="loading" @click="$refs.ConfirmStatusDialog.open()">
                        Thay đổi trạng thái
                    </a-button>
                    <a-button type="primary" :loading="loading" @click="$refs.ComboForm.submit()">
                        Cập nhật
                    </a-button>
                </div>
            </div>
        </div>

        <div class="space-y-4 mt-4">
            <ComboForm
                ref="ComboForm"
                :loading="loading"
                :combo="combo"
                @submit="update"
            />
        </div>

        <div class="space-y-4 mt-4">
            <ComboReview
                ref="ComboReview"
                :comments="comments"
            />
        </div>

        <ConfirmDialog
            ref="ConfirmStatusDialog"
            title="Thay đổi trạng thái"
            @confirm="changeStatus"
        >
            <div class="text-center">
                <p class="text-lg">
                    Bạn chắc chắn thay đổi này chứ?
                </p>
                <span class="block"><span class="font-semibold">Lưu ý</span>: Các thành phần phụ thuộc sẽ thay đổi để phù hợp</span>
            </div>
        </ConfirmDialog>
    </div>
</template>

<script>
    import { STATUS_OPTIONS } from '@/constants/status';
    import { mapState } from 'vuex';
    import PageHeader from '@/components/shared/PageHeader.vue';
    import ComboReview from '@/components/shared/ProductComment.vue';
    import ComboForm from '@/components/combos/Form.vue';
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
    import { convertToFormData } from '@/utils/form';
    import { mapDataFromOptions } from '@/utils/data';

    export default {
        components: {
            PageHeader,
            ComboForm,
            ComboReview,
            ConfirmDialog,
        },

        async fetch() {
            await this.fetchData();
        },

        data() {
            return {
                loading: false,
            };
        },

        computed: {
            ...mapState('combos', ['combo']),
            ...mapState('comments', ['comments', 'ratingAVG', 'pagination']),
            STATUS_LABEL() {
                return this.mapDataFromOptions(STATUS_OPTIONS, 'value', 'label');
            },
            STATUS_COLOR() {
                return this.mapDataFromOptions(STATUS_OPTIONS, 'value', 'color');
            },
        },

        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Danh sách Combo',
                link: '/combos',
            }, {
                label: 'Cập nhật Combo',
                link: `/products/${this.combo.id}/update`,
            }]);
        },

        methods: {
            mapDataFromOptions,

            async fetchData() {
                try {
                    await this.$store.dispatch('categories/fetchAll');
                    await this.$store.dispatch('combos/fetchDetail', this.$route.params.id);
                    await this.$store.dispatch('comments/fetchAll', { id: this.$route.params.id, params: this.$route.query });
                    this.loading = true;
                } catch (e) {
                    this.$handleError(e);
                } finally {
                    this.loading = false;
                }
            },

            async changeStatus() {
                await this.$api.combos.changeStatus(this.$route.params.id, {
                    status: this.combo.status === 'active' ? 'inactive' : 'active',
                });
                this.$message.success('Cập nhật thông tin combo thành công');
                this.$nuxt.refresh();
            },

            async update(payload, fileThumbnail) {
                try {
                    this.loading = true;
                    const _payload = payload;
                    if (fileThumbnail) {
                        const { data: { fileAttributes } } = await this.$api.uploaders.uploadFiles(convertToFormData({
                            files: fileThumbnail,
                        }));
                        _payload.thumbnail = fileAttributes[0]?.source;
                    }
                    await this.$api.combos.update(this.$route.params.id, _payload);
                    this.$message.success('Cập nhật Combo thành công');
                    this.$router.push('/combos');
                } catch (e) {
                    this.$handleError(e);
                } finally {
                    this.loading = false;
                }
            },
        },

        head() {
            return {
                title: 'Cập nhật Combo',
            };
        },
    };
</script>
