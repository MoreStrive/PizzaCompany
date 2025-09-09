<template>
    <div>
        <a-table
            :data-source="categories"
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
                :custom-render="(text, record, index) => index + 1"
            />
            <a-table-column
                key="thumbnail"
                title="Thumbnail danh mục"
                :width="150"
                data-index="thumbnail"
            >
                <template #default="thumbnail">
                    <div class="border-[1px] border-solid border-gray-5 rounded-md overflow-hidden">
                        <img
                            v-if="thumbnail !== ''"
                            :src="thumbnail"
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
                key="title"
                title="Tên danh mục"
                :width="300"
                data-index="title"
                align="center"
            />
            <a-table-column
                key="slug"
                title="Slug"
                :width="300"
                data-index="slug"
                align="center"
            />
            <!-- <a-table-column
                key="status"
                title="Hiển thị"
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
            </a-table-column> -->
            <a-table-column
                key="created_at"
                data-index="created_at"
                title="Ngày tạo"
                align="center"
                :width="150"
            >
                <template #default="created_at">
                    {{ created_at | dateFormat('dd/MM/yyyy') }}
                </template>
            </a-table-column>
            <a-table-column
                v-if="$permission.Admin()"
                key="action"
                title="Thao tác"
                align="center"
                :width="100"
            >
                <template #default="category">
                    <div class="flex items-center justify-center gap-2">
                        <a-button
                            type="primary"
                            shape="circle"
                            class="!leading-[10px]"
                            @click="() => {
                                categorySelected = category,
                                $refs.categoryDialog.open(category)
                            }"
                        >
                            <i class="isax isax-edit" />
                        </a-button>
                        <a-button
                            type="primary"
                            shape="circle"
                            class="!leading-[10px]"
                            @click="() => {
                                categorySelected = category,
                                $refs.confirmDelete.open()
                            }"
                        >
                            <i class="isax isax-trash" />
                        </a-button>
                    </div>
                </template>
            </a-table-column>
        </a-table>

        <ConfirmDialog
            ref="confirmDelete"
            title="Xóa danh mục"
            content="Bạn chắc chắn xóa danh mục này ?"
            @confirm="confirmDelete"
        />

        <CategoryDialog ref="categoryDialog" :category="categorySelected" />
    </div>
</template>

<script>
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
    import CategoryDialog from '@/components/products/categories/Dialog.vue';

    export default {
        components: {
            ConfirmDialog,
            CategoryDialog,
        },

        props: {
            categories: {
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
                categorySelected: null,
                recordSelected: null,
            };
        },

        computed: {
        },

        methods: {

            async confirmDelete() {
                try {
                    await this.$api.categories.delete(this.categorySelected.id);
                    this.$message.success('Xóa danh mục thành công');
                    this.$nuxt.refresh();
                } catch (e) {
                    this.$message.error('Không thể xóa khi còn tồn tại sản phẩm trong danh mục');
                }
            },
        },
    };
</script>
