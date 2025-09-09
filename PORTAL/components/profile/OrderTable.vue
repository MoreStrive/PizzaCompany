<template>
    <div>
        <a-table
            :data-source="orders"
            :pagination="false"
            :scroll="{ x: 1250 }"
            :row-key="(row) => row.id"
            :loading="loading"
        >
            <a-table-column
                key="index"
                title="STT"
                align="center"
                :width="40"
                :custom-render="(text, record, index) => index + 1"
            />
            <a-table-column
                key="shipping_name"
                title="Người nhận"
                :width="100"
            >
                <template #default="record">
                    <div class="">
                        <span class="block font-semibold">{{ record.shipping_name || '--' }}</span>
                        <span class="block">{{ record.shipping_phone || '--' }}</span>
                    </div>
                </template>
            </a-table-column>
            <a-table-column
                key="shipping_address"
                title="Địa chỉ"
                :width="100"
            >
                <template #default="record">
                    <span>{{ record.shipping_address || '--' }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="created_at"
                title="Ngày tạo"
                :width="100"
            >
                <template #default="record">
                    <span>{{ record.created_at | dateFormat('HH:mm dd/MM/yyyy') }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="total_price"
                title="Tổng tiền"
                :width="80"
                align="center"
            >
                <template #default="record">
                    <span>{{ record.total_price | currencyFormat }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="final_price"
                title="Thanh toán"
                :width="80"
                align="center"
            >
                <template #default="record">
                    <span>{{ record.final_price | currencyFormat }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="status"
                title="Trạng thái"
                :width="80"
                align="center"
            >
                <template #default="record">
                    <a-tag :color="STATUS_COLOR[record.status]">
                        {{ STATUS_LABEL[record.status] }}
                    </a-tag>
                </template>
            </a-table-column>
            <a-table-column
                key="action"
                title="Thao tác"
                align="center"
                :width="50"
            >
                <template #default="record">
                    <a-dropdown placement="bottomRight" :trigger="['click']">
                        <a-button class="!mx-auto" size="small">
                            <i class="fas fa-ellipsis-h" />
                        </a-button>
                        <a-menu slot="overlay" class="!w-40">
                            <a-menu-item @click="$refs.DetailOrderDialog.open(record)">
                                Xem chi tiết
                            </a-menu-item>

                            <a-menu-item
                                v-if="record.status === STATUS.COOKING || record.status === STATUS.PENDING"
                                class="!text-danger-80"
                                @click="() => {
                                    orderSelected = record,
                                    statusSelected = STATUS.DELIVERING,
                                    $refs.StatusDialog.open();
                                }"
                            >
                                Hủy đơn hàng
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </template>
            </a-table-column>
        </a-table>

        <ConfirmDialog
            ref="StatusDialog"
            title="Xác nhận chuyển trạng thái"
            @confirm="confirmStatus"
        >
            <div>Bạn chắc chắn muốn hủy đơn hàng này chứ?</div>
        </ConfirmDialog>
        <DetailOrderDialog ref="DetailOrderDialog" />
    </div>
</template>

<script>
    // import Pagination from '@/components/shared/Pagination.vue';
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
    import { STATUS_OPTIONS, STATUS } from '@/constants/orders/status';
    import { mapDataFromOptions } from '@/utils/data';
    import DetailOrderDialog from '@/components/profile/OrderDialog.vue';

    export default {
        components: {
            // Pagination,
            ConfirmDialog,
            DetailOrderDialog,
        },
        props: {
            orders: {
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
                STATUS,
                STATUS_OPTIONS,
                orderSelected: null,
                statusSelected: null,
            };
        },

        computed: {
            STATUS_LABEL() {
                return this.mapDataFromOptions(STATUS_OPTIONS, 'value', 'label');
            },

            STATUS_COLOR() {
                return this.mapDataFromOptions(STATUS_OPTIONS, 'value', 'color');
            },
        },

        methods: {
            mapDataFromOptions,

            async confirmStatus() {
                try {
                    await this.$api.orders.changeStatus(this.orderSelected.id);
                    this.$message.success('Đơn hàng của bạn đã bị hủy!');
                    this.$nuxt.refresh();
                } catch (e) {
                    this.$handleError(e);
                }
            },
        },
    };
</script>
