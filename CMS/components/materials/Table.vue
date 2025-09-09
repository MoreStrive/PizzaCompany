<template>
    <div>
        <a-table
            :data-source="materials"
            :pagination="false"
            :scroll="{ x: 1200 }"
            :row-key="(row) => row.id"
            :loading="loading"
        >
            <a-table-column
                key="index"
                title="STT"
                align="center"
                :width="60"
                :custom-render="
                    (text, record, index) =>index + 1"
            />
            <a-table-column
                key="thumbnail"
                title="Ảnh"
                align="center"
                :width="180"
                data-index="thumbnail"
            >
                <template #default="thumbnail">
                    <img :src="thumbnail || ''" alt="" class="rounded-md w-56 mx-auto h-20 object-cover">
                </template>
            </a-table-column>
            <a-table-column
                key="title"
                title="Tiêu đề"
                :width="150"
                align="center"
                data-index="title"
            >
                <template #default="title">
                    <p v-if="title">
                        {{ title }}
                    </p>
                    <p v-else>
                        {{ 'Trống' }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="code"
                title="Code"
                :width="120"
                align="center"
                data-index="code"
            />
            <a-table-column
                key="quantity"
                title="Số lượng"
                :width="80"
                align="center"
                data-index="quantity"
            />
            <a-table-column
                key="unit"
                data-index="unit"
                title="Đơn vị"
                align="center"
                :width="120"
            />
            <a-table-column
                key="created_at"
                data-index="created_at"
                title="Ngày tạo"
                align="center"
                :width="120"
            >
                <template #default="start_date">
                    {{ start_date | dateFormat('HH:mm dd/MM/yyyy') }}
                </template>
            </a-table-column>
            <a-table-column
                key="action"
                title="Hành động"
                align="center"
                :width="100"
                fixed="right"
            >
                <template #default="record">
                    <a-dropdown placement="bottomRight" :trigger="['click']">
                        <a-button class="!mx-auto" size="small">
                            <i class="fas fa-ellipsis-h" />
                        </a-button>
                        <a-menu slot="overlay" class="!w-40">
                            <a-menu-item
                                @click="() => {
                                    materialSelected = record,
                                    $refs.MaterialDialog.open(record)
                                }"
                            >
                                Chỉnh sửa
                            </a-menu-item>
                            <a-menu-item
                                @click="() => {
                                    materialSelected = record,
                                    $refs.HistoriesDialog.open(record)
                                }"
                            >
                                Xem lịch sử
                            </a-menu-item>
                            <a-menu-item
                                v-if="$permission.Admin()"
                                class="!text-danger-100"
                                @click="() => {
                                    materialSelected = record,
                                    $refs.confirmDelete.open()
                                }"
                            >
                                Xóa
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </template>
            </a-table-column>
        </a-table>
        <ConfirmDialog
            ref="confirmDelete"
            title="Xóa nguyên liệu"
            content="Bạn chắc chắn với hành động này chứ"
            @confirm="confirmDelete"
        />
        <MaterialDialog ref="MaterialDialog" />
        <HistoriesDialog ref="HistoriesDialog" />
    </div>
</template>

<script>
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
    import MaterialDialog from '@/components/materials/Dialog.vue';
    import HistoriesDialog from '@/components/materials/HistoriesDialog.vue';

    export default {
        components: {
            ConfirmDialog,
            MaterialDialog,
            HistoriesDialog,
        },

        props: {
            materials: {
                type: Array,
                default: () => [],
            },
            loading: {
                type: Boolean,
                default: false,
            },
            pagination: {
                type: Object,
                required: false,
            },
        },

        data() {
            return {
                materialSelected: null,
            };
        },
        computed: {
        },

        watch: {
        },
        methods: {
            async confirmDelete() {
                try {
                    await this.$api.materials.delete(this.materialSelected.id);
                    this.$message.success('Xóa thành công!');
                    this.$nuxt.refresh();
                } catch (e) {
                    this.$handleError(e);
                }
            },
        },
    };
</script>
