<template>
    <main>
        <section class="h-[400px] bg-[url('https://swigo.dexignzone.com/tailwind/xhtml/assets/images/background/pic1.png')] after:bg-[#222222e6] py-20 bg-cover bg-center bg-no-repeat bg-fixed relative z-[2] after:content-[''] after:absolute after:z-[-1] after:bg-black-blur after:opacity-100 after:w-full after:h-full after:top-0 after:left-0 after:backdrop-blur-[6px] flex flex-col justify-center">
            <div class="container">
                <div class="text-center">
                    <h2 class="text-7xl leading-[1.4] text-lobster text-white">
                        Tiến hành đặt hàng
                    </h2>
                </div>
            </div>
        </section>
        <div class="container relative py-16 lg:pt-20">
            <div class="flex flex-col lg:flex-row gap-10">
                <div class="flex-1">
                    <a-form-model
                        ref="form"
                        :model="form"
                        :rules="rules"
                    >
                        <div>
                            <h3 class="text-black text-xl mb-5">
                                <span class="uppercase">Thông tin giao hàng</span>
                            </h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <a-form-model-item label="Họ và tên" prop="shipping_name">
                                    <a-input v-model="form.shipping_name" placeholder="Họ và tên người nhận" />
                                </a-form-model-item>
                                <a-form-model-item label="Số điện thoại" prop="shipping_phone">
                                    <a-input v-model="form.shipping_phone" placeholder="Số điện thoại người nhận" />
                                </a-form-model-item>
                                <a-form-model-item class="col-span-2" label="Email" prop="shipping_email">
                                    <a-input v-model="form.shipping_email" placeholder="Email người nhận" />
                                </a-form-model-item>
                                <a-form-model-item class="col-span-2" label="Địa chỉ giao hàng" prop="shipping_address">
                                    <a-textarea v-model="form.shipping_address" :auto-size="{ minRows: 3, maxRows: 5 }" placeholder="Địa chỉ giao hàng" />
                                </a-form-model-item>
                                <a-form-model-item class="col-span-2" label="Ghi chú">
                                    <a-textarea v-model="form.shipping_note" :auto-size="{ minRows: 3, maxRows: 5 }" placeholder="Ghi chú cho người giao hàng" />
                                </a-form-model-item>
                            </div>
                        </div>
                        <div class="mt-5">
                            <h3 class="text-black text-xl mb-2">
                                <span class="uppercase">Phương thức thanh toán</span>
                            </h3>
                            <div>
                                <a-form-model-item prop="payment_method">
                                    <a-radio-group v-model="form.payment_method" size="large" class="!w-full">
                                        <div class="flex justify-between flex-wrap gap-y-2">
                                            <a-radio
                                                v-for="method in PAYMENT_METHODS_OPTIONS"
                                                :key="method.value"
                                                class="w-full sm:w-1/2"
                                                :value="method.value"
                                            >
                                                {{ method.label }}
                                            </a-radio>
                                        </div>
                                    </a-radio-group>
                                </a-form-model-item>
                            </div>
                        </div>
                    </a-form-model>
                </div>
                <div class="w-full xl:w-[40%]">
                    <div v-if="useCart.cart && useCart.cart.length > 0">
                        <div class="grid grid-cols-1 gap-10">
                            <CheckoutCard
                                v-for="cartItem in useCart.cart"
                                :key="cartItem.value"
                                :product="cartItem.product"
                                :cart-item="cartItem"
                            />
                        </div>
                        <div class="mt-10 pt-6 text-sm text-slate-500 border-t border-gray-20">
                            <div>
                                <label class="nc-Label text-base font-medium text-neutral-900">Mã giảm giá:</label>
                                <div class="flex mt-2 gap-5 items-center">
                                    <div class="flex-1">
                                        <a-input v-model="voucherValue" placeholder="Nhập mã giảm giá" />
                                    </div>
                                    <div class="w-40">
                                        <a-button
                                            :disabled="voucherValue === ''"
                                            class="!rounded-full w-full"
                                            type="primary"
                                            :loading="loadingVoucher"
                                            @click="applyVoucher"
                                        >
                                            Áp dụng
                                        </a-button>
                                    </div>
                                </div>
                                <template v-if="currentVoucher === 'Not Found'">
                                    <div class="text-danger-100 mt-2 ml-3 italic text-xs">
                                        Không tìm thấy mã giảm giá nào tương tự!
                                    </div>
                                </template>
                                <div v-else-if="currentVoucher && currentVoucher.message">
                                    <div class="text-danger-100 mt-2 ml-3 italic text-xs">
                                        {{ currentVoucher.message }}
                                    </div>
                                </div>
                                <div v-else-if="currentVoucher && !currentVoucher.message" class="text-success-80 mt-2 ml-3 italic text-xs">
                                    Áp dụng mã giảm giá thành công
                                </div>
                            </div>
                            <div class="mt-7 text-slate-500 divide-y divide-gray-20">
                                <div class="flex justify-between pb-4">
                                    <span class="text-slate-800">Giá tiền</span>
                                    <span class="font-semibold text-slate-900">{{ useCart.finalCartPrice | currencyFormat }}</span>
                                </div>
                                <div class="flex justify-between py-4">
                                    <span class="text-slate-800">Hội viên</span>
                                    <span class="font-semibold text-slate-900">-{{ calculatePrice.customerClassPrice | currencyFormat }}</span>
                                </div>
                                <template v-if="currentVoucher && !currentVoucher.message">
                                    <div class="flex justify-between py-4">
                                        <span class="text-slate-800">Áp dụng Voucher</span>
                                        <span class="font-semibold text-slate-900">-{{ calculatePrice.voucherPrice | currencyFormat }}</span>
                                    </div>
                                </template>
                                <div class="flex justify-between font-semibold text-slate-900 text-base pt-4">
                                    <span class="font-semibold text-slate-900">Tổng tiền</span>
                                    <span class="font-semibold text-slate-900 text-right">{{ calculatePrice.final_price | currencyFormat }}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            v-if="useCart.cart && useCart.cart.length > 0"
                            class="relative h-auto inline-flex items-center justify-center rounded-full
                                    text-sm sm:text-base font-medium py-3 px-4 sm:py-3.5 sm:px-6
                                    bg-primary-100 !text-white hover:shadow-xl mt-8 w-full transition-all duration-300"
                            @click="submitForm"
                        >
                            Đồng ý đặt hàng
                        </button>
                    </div>
                    <div v-else>
                        <div class="py-10">
                            <a-empty>
                                <span slot="description" class="block mt-5"> Chưa có sản phẩm trong giỏ hàng :( </span>
                            </a-empty>
                        </div>
                        <nuxt-link
                            class="relative h-auto inline-flex items-center justify-center rounded-full
                                    text-sm sm:text-base font-medium py-3 px-4 sm:py-3.5 sm:px-6
                                    bg-primary-100 !text-white hover:shadow-xl mt-8 w-full transition-all duration-300"
                            to="/san-pham"
                        >
                            Đặt hàng ngay
                        </nuxt-link>
                    </div>
                </div>
            </div>
        </div>
        <RequestLoginDialog ref="RequestLoginDialog" />
        <CheckoutDialog ref="CheckoutDialog" :loading="loading" @submit="confirmOrder" />
    </main>
</template>

<script>
    import { mapGetters } from 'vuex';
    import _cloneDeep from 'lodash/cloneDeep';
    import { validEmail, phoneValidator, convertToFormData } from '@/utils/form';
    import CheckoutCard from '@/components/carts/CheckoutCard.vue';
    import RequestLoginDialog from '@/components/shared/RequestLoginDialog.vue';
    import { mapDataFromOptions } from '@/utils/data';
    import { PAYMENT_METHODS_OPTIONS, PAYMENT_METHODS } from '@/constants/checkout';
    import CheckoutDialog from '@/components/checkout/Dialog.vue';

    const defaultForm = {
        payment_method: PAYMENT_METHODS.CASH,
        payment_confirmation: '',
    };
    export default {
        components: {
            CheckoutDialog,
            CheckoutCard,
            RequestLoginDialog,
        },

        async fetch() {
            await this.fetchData();
        },

        data() {
            return {
                PAYMENT_METHODS,
                PAYMENT_METHODS_OPTIONS,
                loading: false,
                form: _cloneDeep(defaultForm) || {},
                rules: {
                    shipping_name: [{ required: true, message: 'Không được để trống trường này.', trigger: 'change' }],
                    shipping_phone: [{ required: true, validator: phoneValidator, trigger: 'change' }],
                    shipping_email: [{ required: true, validator: validEmail, trigger: 'change' }],
                    shipping_address: [{ required: true, message: 'Không được để trống trường này.', trigger: 'change' }],
                },
                voucherValue: '',
                loadingVoucher: false,
                currentVoucher: null,
            };
        },

        computed: {
            ...mapGetters('products', ['useCart']),
            currentUser() {
                return this.$auth.user;
            },
            calculatePrice() {
                let voucherPrice = 0;
                let customerClassPrice = 0;
                let final_price = 0;
                if (this.currentVoucher && !this.currentVoucher.message) {
                    if (this.currentVoucher.discount_type === 'percent') {
                        voucherPrice = (this.useCart.finalCartPrice / 100) * +this.currentVoucher.discount_value;
                    } else if (this.currentVoucher.discount_type === 'cash') {
                        voucherPrice = +this.currentVoucher.discount_value;
                    }
                }
                if (this.currentUser && this.currentUser.customer_class) {
                    switch (this.currentUser.customer_class) {
                        case 'Silver':
                            customerClassPrice = (this.useCart.finalCartPrice / 100) * 1; // percent
                            break;
                        case 'Gold':
                            customerClassPrice = (this.useCart.finalCartPrice / 100) * 2; // percent
                            break;
                        case 'Diamond':
                            customerClassPrice = (this.useCart.finalCartPrice / 100) * 3; // percent
                            break;
                        default:
                            customerClassPrice = 0;
                    }
                }
                final_price = this.useCart.finalCartPrice - voucherPrice - customerClassPrice;
                return {
                    voucherPrice,
                    customerClassPrice,
                    final_price,
                };
            },
        },

        mounted() {
            const checkoutForm = localStorage.getItem('checkoutForm') || '{}';
            this.form = Object.assign(defaultForm, JSON.parse(checkoutForm));
        },

        methods: {
            mapDataFromOptions,
            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('products/fetchAll', this.$route.query);
                    await this.$store.dispatch('products/fetchCart');
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },

            async applyVoucher() {
                try {
                    this.loadingVoucher = true;
                    const { data: { discount } } = await this.$api.discounts.getByCode({ code: this.voucherValue });
                    this.currentVoucher = discount;
                } catch {
                    this.$message.info('Không tìm thấy mã giảm giá tương tự');
                    this.currentVoucher = 'Not Found';
                } finally {
                    this.loadingVoucher = false;
                }
            },

            async submitForm() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        if (this.$auth.user) {
                            if (this.form.payment_method === PAYMENT_METHODS.PAYMENT) {
                                this.$refs.CheckoutDialog.open();
                            } else {
                                await this.confirmOrder();
                            }
                        } else {
                            this.$message.info('Đăng nhập để tiếp tục');
                            this.$refs.RequestLoginDialog.open();
                            localStorage.setItem('checkoutForm', JSON.stringify(this.form));
                        }
                    } else {
                        this.$message.info('Vui lòng đầy đủ trường thông tin cần thiết!');
                    }
                });
            },

            async confirmOrder(file) {
                try {
                    this.loading = true;
                    if (this.form.payment_method === PAYMENT_METHODS.PAYMENT) {
                        const { data: { fileAttributes } } = await this.$api.uploaders.uploadFiles(convertToFormData({ files: file }));
                        await this.$api.orders.create({
                            ...this.form,
                            payment_method: PAYMENT_METHODS.PAYMENT,
                            payment_confirmation: fileAttributes[0]?.source,
                            orderItems: [...this.useCart.cart],
                            shipping_fee: 0,
                            discount: { ...this.currentVoucher },
                        });
                    } else {
                        await this.$api.orders.create({
                            ...this.form,
                            payment_method: PAYMENT_METHODS.CASH,
                            payment_confirmation: '',
                            orderItems: [...this.useCart.cart],
                            shipping_fee: 0,
                            discount: { ...this.currentVoucher },
                        });
                    }
                    localStorage.setItem('checkoutForm', JSON.stringify({}));
                    this.$store.dispatch('products/clearCart');
                    this.$message.success('Đặt hàng thành công! Vui lòng kiểm tra Email');
                    this.$router.push('/');
                } catch (error) {
                    this.$message.error('Thanh toán thất bại!');
                } finally {
                    this.loading = false;
                }
            },
        },
    };
</script>
