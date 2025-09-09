<template>
    <div>
        <a-table
            :data-source="discounts"
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
                :width="200"
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
                key="count"
                title="Số lượng"
                :width="80"
                align="center"
                data-index="count"
            />
            <a-table-column
                key="status"
                title="Hoạt động"
                :width="90"
                align="center"
            >
                <template #default="record">
                    <a-switch
                        :default-checked="record.status === 'active'"
                        @click="updateStatus(record)"
                        @change="onChange"
                    />
                </template>
            </a-table-column>
            <a-table-column
                key="start_date"
                data-index="start_date"
                title="Ngày bắt đầu"
                align="center"
                :width="120"
            >
                <template #default="start_date">
                    {{ start_date | dateFormat('HH:mm dd/MM/yyyy') }}
                </template>
            </a-table-column>
            <a-table-column
                key="expiration_date"
                data-index="expiration_date"
                title="Ngày hết hạn"
                align="center"
                :width="120"
            >
                <template #default="expiration_date">
                    {{ expiration_date | dateFormat('HH:mm dd/MM/yyyy') }}
                </template>
            </a-table-column>
            <a-table-column
                v-if="$permission.Admin()"
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
                                    discountSelected = record,
                                    $refs.discountDialog.open(record)
                                }"
                            >
                                Chỉnh sửa
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </template>
            </a-table-column>
        </a-table>
        <ConfirmDialog
            ref="confirmDelete"
            title="Xóa mã giảm giá"
            content="Bạn chắc chắn với hành động này chứ"
            @confirm="confirmDelete"
        />
        <DiscountDialog ref="discountDialog" :discount="discountSelected" />
    </div>
</template>

<script>
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
    import DiscountDialog from '@/components/discounts/Dialog.vue';

    export default {
        components: {
            ConfirmDialog,
            DiscountDialog,
        },

        props: {
            discounts: {
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
                discountSelected: null,
                recordSelected: null,
            };
        },
        computed: {
        },

        watch: {
        },

        methods: {
            async updateStatus(record) {
                this.recordSelected = record;
                try {
                    this.$api.discounts.update(this.recordSelected.id, { status: this.recordSelected.status === 'active' ? 'inactive' : 'active' });
                    this.statusWitch = null;
                } catch (e) {
                    this.$handleError(e);
                }
            },

            onChange(record) {
                this.statusWitch = record;
            },

            async confirmDelete() {
                try {
                    await this.$api.discounts.delete(this.discountSelected.name);
                    this.$message.success('Deleted Success');
                    this.$nuxt.refresh();
                } catch (e) {
                    this.$handleError(e);
                }
            },
        },
    };
</script>
