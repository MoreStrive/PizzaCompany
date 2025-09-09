<!-- eslint-disable no-unneeded-ternary -->
<!-- eslint-disable no-unneeded-ternary -->
<template>
    <div>
        <a-table
            :data-source="products"
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
                key="product_name"
                title="Tên sản phẩm"
                :width="120"
                align="center"
            >
                <template #default="record">
                    <nuxt-link v-if="$permission.Admin() || $permission.Manage()" :to="`/products/${record.id}/update`" class="!text-link-100 !underline hover:!no-underline">
                        {{ record.product_name || '--' }}
                    </nuxt-link>
                    <span v-else>
                        {{ record.product_name || '--' }}
                    </span>
                </template>
            </a-table-column>
            <a-table-column
                key="description"
                title="Mô tả"
                :width="150"
                align="center"
            >
                <template #default="record">
                    <span class="line-clamp-2">{{ record.description || '--' }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="count"
                title="Số lượng"
                :width="100"
                align="center"
            >
                <template #default="record">
                    <span class="line-clamp-2">{{ record.count || '--' }}</span>
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
                    <span>{{ record.created_at | dateFormat() }}</span>
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
                                <nuxt-link :to="`/products/${record.id}/update`">
                                    Chỉnh sửa
                                </nuxt-link>
                            </a-menu-item>
                            <a-menu-item
                                v-if="$permission.Admin()"
                                class="!text-danger-100"
                                :disabled="record.isDeleted"
                                @click="() => {
                                    productselected = record,
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
            title="Xóa sản phẩm"
            @confirm="confirmDelete"
        >
            <div class="text-center">
                <p class="text-lg">
                    Bạn chắc chắn xóa sản phẩm này chứ?
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
            products: {
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
                productselected: null,
                status: null,
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
                // eslint-disable-next-line no-unneeded-ternary, no-confusing-arrow
                return (data) => data === 'active' ? true : false;
            },
        },

        methods: {
            mapDataFromOptions,

            async updateStatus() {
                try {
                    this.$api.products.changeStatus(this.productselected.id, { status: this.productselected.status === 'active' ? 'inactive' : 'active' });
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
                    await this.$api.products.delete(this.productselected.id);
                    this.$message.success('Xóa sản phẩm thành công');
                    this.$nuxt.refresh();
                } catch (e) {
                    this.$handleError(e);
                }
            },
        },
    };
</script>
