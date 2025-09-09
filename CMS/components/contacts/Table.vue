<template>
    <div>
        <a-table
            :data-source="contacts"
            :pagination="false"
            :scroll="{ x: 1000 }"
            :row-key="(row) => row.id"
            :loading="loading"
        >
            <a-table-column
                key="index"
                title="No."
                align="center"
                :width="60"
                :custom-render="(text, record, index) => index + 1"
            />
            <a-table-column
                key="fullname"
                title="Tên khách hàng"
                :width="120"
                align="center"
            >
                <template #default="record">
                    <span>{{ record.fullname || '--' }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="email"
                title="Email"
                :width="150"
                align="center"
            >
                <template #default="record">
                    <span>{{ record.email || '--' }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="status"
                title="Trạng thái"
                :width="150"
                align="center"
            >
                <template #default="record">
                    <a-tag :color="STATUS_COLOR[record.status]">
                        {{ STATUS_LABLE[record.status] || '--' }}
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
                key="action"
                title="Hành động"
                align="center"
                :width="80"
            >
                <template #default="record">
                    <a-dropdown placement="bottomRight" :trigger="['click']">
                        <a-button class="!mr-0" size="small">
                            <i class="fas fa-ellipsis-h" />
                        </a-button>
                        <a-menu slot="overlay" class="!w-40">
                            <a-menu-item @click="updateContact(record)">
                                Xem thêm
                            </a-menu-item>
                            <a-menu-item
                                class="!text-danger-100"
                                :disabled=" record.isDeleted"
                                @click="() => {
                                    contactselected = record,
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

        <ConfirmDialog
            ref="ConfirmDialog"
            title="Xóa thư này"
            @confirm="confirmDelete"
        >
            <div class="text-center">
                <p class="text-lg">
                    Bạn chắc chắn muốn xóa thư này chứ
                </p>
                <span class="block"><span class="font-semibold">Lưu ý</span>: Không thể hoàn tác</span>
            </div>
        </ConfirmDialog>

        <ContactDialog ref="ContactDialog" />
    </div>
</template>

<script>
    import { mapDataFromOptions } from '@/utils/data';
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
    import ContactDialog from '@/components/contacts/Dialog.vue';
    import { STATUS, STATUS_OPTIONS } from '@/constants/contacts/status';

    export default {
        components: {
            ConfirmDialog,
            ContactDialog,
        },
        props: {
            contacts: {
                type: Array,
                default: () => [],
            },
            loading: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                contactselected: null,
            };
        },

        computed: {
            STATUS_LABLE() {
                return mapDataFromOptions(STATUS_OPTIONS, 'value', 'label');
            },
            STATUS_COLOR() {
                return mapDataFromOptions(STATUS_OPTIONS, 'value', 'color');
            },
        },

        methods: {
            async updateContact(contact) {
                try {
                    this.$refs.ContactDialog.open(contact);
                    await this.$api.contacts.update(
                        contact.id,
                        { ...contact, status: STATUS.PROCESSED },
                    );
                    this.$nuxt.refresh();
                } catch (e) {
                    console.log(e);
                }
            },

            async confirmDelete() {
                try {
                    await this.$api.contacts.delete(this.contactselected.id);
                    this.$message.success('Delete successfuly !');
                    this.$nuxt.refresh();
                } catch (e) {
                    this.$handleError(e);
                }
            },
        },
    };
</script>
