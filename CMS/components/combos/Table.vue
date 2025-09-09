<template>
    <div>
        <a-table
            :data-source="combos"
            :pagination="false"
            :scroll="{ x: 1000 }"
            :row-key="(row) => row.id"
            :loading="loading"
        >
            <a-table-column
                key="index"
                title="STT"
                align="center"
                :width="60"
                :custom-render="(text, record, index) => index + 1"
            />
            <a-table-column
                key="thumbnail"
                title="Ảnh Thumbnail"
                :width="150"
                align="center"
            >
                <template #default="record">
                    <div class="border-[1px] border-solid border-gray-5 rounded-md">
                        <img
                            v-if="record.thumbnail !== ''"
                            :src="record.thumbnail"
                            alt=""
                            class="w-full h-20 object-cover"
                        >
                        <p v-else>
                            Không có dữ liệu
                        </p>
                    </div>
                </template>
            </a-table-column>
            <a-table-column
                key="comboName"
                title="title"
                :width="120"
                align="center"
            >
                <template #default="record">
                    <nuxt-link :to="`/combos/${record.id}/update`" class="!text-link-100 !underline hover:!no-underline">
                        {{ record.title || '--' }}
                    </nuxt-link>
                </template>
            </a-table-column>
            <a-table-column
                key="count"
                title="Số lượng"
                :width="120"
                align="center"
            >
                <template #default="record">
                    <span class="line-clamp-2">{{ record.count || '--' }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="total_price"
                title="Tổng tiền"
                :width="120"
                align="center"
            >
                <template #default="record">
                    <span class="line-clamp-2">{{ record.total_price | currencyFormat }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="status"
                title="Trạng thái"
                :width="100"
                align="center"
            >
                <template #default="record">
                    <a-tag :color="STATUS_COLOR[record.status]">
                        {{ STATUS_LABEL[record.status] }}
                    </a-tag>
                </template>
            </a-table-column>
            <a-table-column
                key="created_at"
                title="Ngày tạo"
                :width="100"
                align="center"
            >
                <template #default="record">
                    <span>{{ record.created_at | dateFormat }}</span>
                </template>
            </a-table-column>
            <a-table-column
                v-if="$permission.Admin() || $permission.Manage()"
                key="action"
                title="Thao tác"
                align="center"
                :width="80"
            >
                <template #default="record">
                    <a-dropdown placement="bottomRight" :trigger="['click']">
                        <a-button class="!mx-auto" size="small">
                            <i class="fas fa-ellipsis-h" />
                        </a-button>
                        <a-menu slot="overlay" class="!w-40">
                            <a-menu-item>
                                <nuxt-link :to="`/combos/${record.id}/update`">
                                    Chỉnh sửa
                                </nuxt-link>
                            </a-menu-item>
                            <a-menu-item
                                class="!text-danger-100"
                                :disabled="record.isDeleted"
                                @click="() => {
                                    comboSelected = record,
                                    $refs.ConfirmDialog.open();
                                }"
                            >
                                {{ record.isDeleted ? "Không thể xóa" : "Xóa" }}
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </template>
            </a-table-column>
        </a-table>
        <Pagination :data="pagination" />
        <ConfirmDialog
            ref="ConfirmDialog"
            title="Xóa Combo"
            @confirm="confirmDelete"
        >
            <div class="text-center">
                <p class="text-lg">
                    Bạn chắc chắn xóa combo này chứ?
                </p>
                <span class="block"><span class="font-semibold">Lưu ý</span>: hành động sẽ không thể hoàn tác</span>
            </div>
        </ConfirmDialog>
        <ConfirmDialog
            ref="ConfirmStatusDialog"
            title="Thay đổi trạng thái"
            @confirm="updateStatus"
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
    import Pagination from '@/components/shared/Pagination.vue';
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
    import { mapDataFromOptions } from '@/utils/data';

    export default {
        components: {
            Pagination,
            ConfirmDialog,
        },
        props: {
            combos: {
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
                STATUS_OPTIONS,
                comboSelected: null,
            };
        },

        computed: {
            STATUS_LABEL() {
                return this.mapDataFromOptions(STATUS_OPTIONS, 'value', 'label');
            },
            STATUS_COLOR() {
                return this.mapDataFromOptions(STATUS_OPTIONS, 'value', 'color');
            },
            STATUS() {
                return (data) => data === 'active';
            },
        },

        methods: {
            mapDataFromOptions,

            async updateStatus() {
                try {
                    this.$api.combos.changeStatus(this.comboSelected.id, { status: this.comboSelected.status === 'active' ? 'inactive' : 'active' });
                    this.reload();
                } catch (e) {
                    this.$handleError(e);
                }
            },

            reload() {
                this.$nuxt.refresh();
                this.$forceUpdate();
            },

            async confirmDelete() {
                try {
                    await this.$api.combos.delete(this.comboSelected.id);
                    this.$message.success('Xóa Combo thành công');
                    this.$nuxt.refresh();
                } catch (e) {
                    this.$handleError(e);
                }
            },
        },
    };
</script>
