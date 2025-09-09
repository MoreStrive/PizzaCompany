<template>
    <a-modal
        v-model="visible"
        width="800px"
        destroy-on-close
        :title="`Lịch sử: ${material ? material.title : ''}`"
    >
        <div class="flex-1">
            <div class="grid grid-cols-1 gap-5 max-h-[600px] overflow-y-scroll">
                <template v-if="histories && histories.length > 0">
                    <div v-for="history in histories" :key="history.id">
                        <div v-if="history.staff.id" class="flex justify-between">
                            <div class="flex items-start gap-4 flex-1">
                                <img class="w-12 h-12 rounded-full object-cover" :src="history.staff.avatar" :alt="history.staff && history.staff.full_name">
                                <div>
                                    <h4 class="mb-0">
                                        {{ history.staff && history.staff.full_name }} - <span class="font-light">{{ history.staff.role }}</span>
                                    </h4>
                                    <div class="mt-1 font-normal">
                                        {{ history.content }}
                                    </div>
                                </div>
                            </div>
                            <div class="text-right">
                                <h4 class="text-sm">
                                    Thời gian: {{ history.created_at | dateFormat('HH:mm dd/MM/yyyy') }}
                                </h4>
                                <h4 class="text-sm">
                                    Số lượng: {{ history.quantity }} {{ history.unit }}
                                </h4>
                            </div>
                        </div>
                    </div>
                </template>
                <div v-else>
                    <a-empty description="Chưa có lịch sử" />
                </div>
            </div>
        </div>
        <div slot="footer" class="flex justify-center items-center gap-2 mt-3">
            <a-button class="w-28" @click="close">
                Đóng
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    import { mapState } from 'vuex';
    import _isEmpty from 'lodash/isEmpty';
    import _cloneDeep from 'lodash/cloneDeep';
    import { UNIT, UNIT_OPTIONS } from '@/constants/materials/unit';

    const defaultForm = {
        quantity: 0,
        content: '',
    };

    export default {
        data() {
            const quantityValidator = (rule, value, callback) => {
                if (value < this.material?.quantity) {
                    callback();
                } else {
                    callback(new Error('Số lượng không lớn hơn số lượng còn lại'));
                }
            };

            return {
                UNIT,
                UNIT_OPTIONS,
                visible: false,
                loading: false,
                material: null,
                query: null,
                form: _cloneDeep(defaultForm),
                rules: {
                    quantity: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }, {
                        validator: quantityValidator, trigger: ['change', 'blur'],
                    }],
                    content: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                },
            };
        },

        computed: {
            ...mapState('materials', ['histories']),
        },

        watch: {
            material() {
                this.form = _cloneDeep(defaultForm);
            },
        },

        methods: {
            _isEmpty,

            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('materials/fetchHistories', { id: this.material.id, params: { ...this.query } });
                } catch (e) {
                    this.$handleError(e);
                } finally {
                    this.loading = false;
                }
            },

            async open(material) {
                this.material = material;
                await this.fetchData();
                this.visible = true;
            },

            close() {
                this.visible = false;
            },

            async submit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        try {
                            this.loading = true;
                            await this.$api.materialHistories.create({ material_id: this.material.id, staff_id: this.$auth.user.id, ...this.form });
                            this.$message.success('Cập nhật nguyên liệu thành công');
                            this.close();
                            await this.$nuxt.refresh();
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
