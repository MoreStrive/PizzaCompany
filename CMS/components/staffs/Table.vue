<template>
    <div class="table-client">
        <a-table
            :data-source="staffs"
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
                key="full_name"
                title="Họ và tên"
                :width="180"
                align="left"
            >
                <template #default="record">
                    <div>
                        <div class="flex items-center gap-3 mb-1">
                            <a-avatar
                                size="large"
                                :src="record.avatar"
                                icon="staff"
                                class="flex-shrink-0"
                            />
                            <span class="flex flex-col text-start">
                                <span class="font-semibold">{{ record.full_name || '--' }}</span>
                                <span>{{ record.email }}</span>
                            </span>
                        </div>
                    </div>
                </template>
            </a-table-column>
            <a-table-column
                key="phone_number"
                title="Số điện thoại"
                :width="100"
                align="center"
            >
                <template #default="record">
                    <span>{{ record.phone_number }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="gender"
                title="Giới tính"
                :width="80"
                align="center"
            >
                <template #default="record">
                    <span>{{ GENDER_LABEL[record.gender] || '--' }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="status"
                title="Trạng thái"
                :width="120"
                align="center"
            >
                <template #default="record">
                    <div class="w-full text-center">
                        <a-tag :color="STATUS_COLOR[record.status]" class="mx-auto">
                            {{ STATUS_LABEL[record.status] }}
                        </a-tag>
                    </div>
                </template>
            </a-table-column>
            <a-table-column
                key="created_at"
                title="Ngày tạo"
                :width="100"
                align="center"
            >
                <template #default="record">
                    <span v-if="record.join_date">{{ record.join_date | dateFormat }}</span>
                    <span v-else>{{ record.created_at | dateFormat }}</span>
                </template>
            </a-table-column>
            <a-table-column
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
                                <nuxt-link :to="`/staffs-manage/${record.id}/update`">
                                    Chỉnh sửa
                                </nuxt-link>
                            </a-menu-item>
                            <a-menu-item
                                v-if="$permission.Admin()"
                                class="!text-danger-100"
                                @click="() => {
                                    staffSelected = record,
                                    $refs.ConfirmDialog.open();
                                }"
                            >
                                Xóa
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </template>
            </a-table-column>
        </a-table>
        <Pagination :data="pagination" />
        <ConfirmDialog
            ref="ConfirmDialog"
            title="Xóa nhân viên"
            @confirm="confirmDelete"
        >
            <div class="text-center">
                <p class="text-lg">
                    Bạn chắc chắn xóa nhân viên này chứ?
                </p>
                <span class="block"><span class="font-semibold">Lưu ý</span>: hành động sẽ không thể hoàn tác</span>
            </div>
        </ConfirmDialog>
    </div>
</template>

<script>
    import Pagination from '@/components/shared/Pagination.vue';
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
    import { mapDataFromOptions } from '@/utils/data';
    import { USER_GENDER_OPTIONS } from '@/constants/user/gender';
    import { USER_STATUS_OPTIONS } from '@/constants/user/status';

    export default {
        components: {
            Pagination,
            ConfirmDialog,
        },
        props: {
            staffs: {
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
                USER_GENDER_OPTIONS,
                USER_STATUS_OPTIONS,
                staffSelected: null,
            };
        },

        computed: {
            GENDER_LABEL() {
                return this.mapDataFromOptions(USER_GENDER_OPTIONS, 'value', 'label');
            },
            STATUS_LABEL() {
                return this.mapDataFromOptions(USER_STATUS_OPTIONS, 'value', 'label');
            },
            STATUS_COLOR() {
                return this.mapDataFromOptions(USER_STATUS_OPTIONS, 'value', 'color');
            },
        },

        methods: {
            mapDataFromOptions,

            async confirmDelete() {
                try {
                    await this.$api.staffs.delete(this.staffSelected.id);
                    this.$message.success('Xóa nhân viên thành công');
                    this.$nuxt.refresh();
                } catch (e) {
                    this.$handleError(e);
                }
            },
        },
    };
</script>

<style lang="scss">
    .table-client {
        .ant-table-body {
            @apply max-h-[48vh] #{!important}
        }
    }
</style>
