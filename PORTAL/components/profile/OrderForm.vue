<template>
    <div :class="`w-full 'bg-white' : 'bg-[#18191a]' px-3 xl:px-0 overflow-auto pb-4`">
        <a-form-model
            ref="form"
            :model="form"
            :rules="rules"
        >
            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-12 xl:col-span-6 p-3 rounded-md bg-white">
                    <p>1. Thông tin người đặt</p>
                    <div class=" text-lg">
                        <div class="mb-2">
                            <strong>Tên người nhận:</strong> {{ form.shipping_name || '--' }}
                        </div>
                        <div class="mb-2">
                            <strong>Số điện thoại người nhận:</strong> {{ form.shipping_phone || '--' }}
                        </div>
                        <div class="mb-2">
                            <strong>Email người nhận:</strong> {{ form.shipping_email || '--' }}
                        </div>
                        <div class="mb-2">
                            <strong>Địa chỉ người nhận:</strong> {{ form.shipping_address || '--' }}
                        </div>
                        <div>
                            <strong>Ghi chú:</strong> {{ form.shipping_note || '--' }}
                        </div>
                    </div>
                    <div class="bg-white mb-3 rounded-md mt-4">
                        <p> 2. Sản phẩm trong đơn hàng </p>
                        <div class="mt-3 grid grid-cols-1 gap-y-4">
                            <ProductCard
                                v-for="_product in order.order_items"
                                :key="_product.id"
                                :product="_product"
                            />
                        </div>
                    </div>
                </div>
                <div class="col-span-12 xl:col-span-6">
                    <div class="p-3">
                        <p class="mb-0">
                            4. Thanh toán
                        </p>
                        <div class="mt-3 grid grid-cols-1 gap-2 text-lg">
                            <div>
                                <strong>Thời gian tạo:</strong> {{ form.created_at | dateFormat('HH:mm dd/MM/yyyy') }}
                            </div>
                            <div>
                                <strong>Phương thức:</strong> {{ form.payment_method === 'cash' ? 'Thanh toán tiền mặt' : 'Thanh toán Online' }}
                            </div>
                            <div>
                                <strong>Phí vận chuyển: Miễn phí</strong>
                            </div>

                            <div class="mt-5 grid grid-cols-1 gap-2">
                                <div>
                                    <strong>Giá tiền:</strong> {{ order.total_price | currencyFormat }}
                                </div>
                                <div>
                                    <strong>Hội viên:</strong> -{{ calculatePrice.customerClassPrice | currencyFormat }}
                                </div>
                                <template v-if="order.discount">
                                    <div v-if="order.discount.discount_value && order.discount.discount_type">
                                        <strong>Mã giảm giá:</strong> -{{ calculatePrice.voucherPrice | currencyFormat }}
                                    </div>
                                </template>
                                <div class="mt-3">
                                    <strong>Số tiền phải thanh toán:</strong> {{ order.final_price | currencyFormat }}
                                </div>
                            </div>
                            <div v-if="form.payment_confirmation" class="mt-3">
                                <strong>Chứng thực:</strong>
                                <div class="mt-2">
                                    <img class="max-w-[300px] h-auto object-cover" :src="form.payment_confirmation || ''" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </a-form-model>
    </div>
</template>

<script>
    import _isEmpty from 'lodash/isEmpty';
    import { mapState, mapGetters } from 'vuex';
    import _cloneDeep from 'lodash/cloneDeep';
    import { mapDataFromOptions } from '@/utils/data';
    import ProductCard from '@/components/profile/ProductCard.vue';
    import { DISCOUNT_OPTIONS } from '@/constants/discount/discount';

    const form = {
        note: '',
        userId: '',
        shippingFee: 0,
    };

    export default {
        components: {
            ProductCard,
        },

        props: {
            orderId: {
                type: Number,
                default: null,
            },
            isEdit: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                form: this.order ? _cloneDeep(this.order) : _cloneDeep(form),
                rules: {
                    userId: [{ required: true, message: 'Vui lòng nhập tên người nhận', trigger: 'blur' }],
                    shipping_name: [{ required: true, message: 'Vui lòng nhập tên người nhận', trigger: 'blur' }],
                    shipping_phone: [{ required: true, message: 'Vui lòng nhập số điện thoại người nhận', trigger: 'blur' }],
                    shipping_address: [{ required: true, message: 'Vui lòng nhập địa chỉ người nhận', trigger: 'blur' }],
                },
            };
        },

        computed: {
            DISCOUNT_LABEL() {
                return mapDataFromOptions(DISCOUNT_OPTIONS, 'value', 'label');
            },
            ...mapState('orders', ['order']),
            ...mapState('products', ['products']),
            ...mapState('combos', ['combos']),
            ...mapGetters('products', ['useCart']),
            currentUser() {
                return this.$auth.user;
            },
            calculatePrice() {
                let voucherPrice = 0;
                let customerClassPrice = 0;
                if (this.order.discount) {
                    if (this.order.discount.discount_type && this.order.discount.discount_value) {
                        if (this.order.discount.discount_type === 'percent') {
                            voucherPrice = (this.order.total_price / 100) * this.order.discount.discount_value;
                        } else if (this.order.discount.discount_type === 'cash') {
                            voucherPrice = this.order.discount.discount_value;
                        }
                    }
                }
                if (this.currentUser && this.currentUser.customer_class) {
                    switch (this.currentUser.customer_class) {
                        case 'Silver':
                            customerClassPrice = (this.order.total_price / 100) * 1; // percent
                            break;
                        case 'Gold':
                            customerClassPrice = (this.order.total_price / 100) * 2; // percent
                            break;
                        case 'Diamond':
                            customerClassPrice = (this.order.total_price / 100) * 3; // percent
                            break;
                        default:
                            customerClassPrice = 0;
                    }
                }

                return {
                    voucherPrice,
                    customerClassPrice,
                };
            },
        },

        watch: {
            order() {
                this.form = this.order ? _cloneDeep(this.order) : _cloneDeep(form);
            },
        },

        async mounted() {
            await this.fetchData();
        },

        methods: {
            _isEmpty,

            async fetchData() {
                try {
                    await this.$store.dispatch('orders/fetchDetail', this.orderId);
                } catch (e) {
                    this.$handleError(e);
                }
            },
        },
    };
</script>
