<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        title=""
        :footer="false"
        width="1200px"
    >
        <section v-if="product">
            <div>
                <div class="grid grid-cols-4 gap-8">
                    <div class="col-span-2">
                        <div class="h-[550px]">
                            <img :src="product && product?.thumbnail" class="w-full h-[550px] object-cover rounded-md" alt="">
                        </div>
                    </div>
                    <div class="col-span-2">
                        <div>
                            <h1 class="text-4xl font-semibold">
                                {{ product.product_name }}
                            </h1>
                            <div class="xl:flex lg:block sm:flex items-center mt-5 space-x-4 sm:space-x-5">
                                <div class="flex items-center">
                                    <a href="#reviews" class="flex items-center text-sm font-medium">
                                        <i class="fas fa-star text-[#fbbf24] text-lg relative -top-0.5" />
                                        <div class="ml-1.5 flex text-lg">
                                            <span>4.5</span>
                                            <span class="block mx-2">-</span>
                                            <span class="text-slate-600 underline">10 reviews</span>
                                        </div>
                                    </a>
                                    <span class="hidden sm:block mx-2.5">·</span>
                                    <div class="hidden sm:flex items-center text-sm">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                            class="w-3.5 h-3.5"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                                            />
                                        </svg>
                                        <span class="ml-1 leading-none">Sản phẩm bán chạy</span>
                                    </div>
                                </div>
                            </div>
                            <p class="text-lg mt-4">
                                {{ product.description }}
                            </p>

                            <div class="mt-4">
                                <div class="grid grid-cols-2 gap-4">
                                    <a-form-model-item v-if="product.options && product.options.length > 0" prop="" label="Lựa chọn">
                                        <a-select
                                            v-model="option"
                                            placeholder="Lựa chọn"
                                            class="!w-full"
                                        >
                                            <a-select-option v-for="_option in product.options" :key="_option.value" :value="_option.value">
                                                {{ OPTION_LABEL[_option.value] }}
                                            </a-select-option>
                                        </a-select>
                                    </a-form-model-item>
                                    <a-form-model-item v-if="product.sizes && product.sizes.length > 0" prop="" label="Chọn Size">
                                        <a-select
                                            v-model="size"
                                            placeholder="Size bánh"
                                            class="!w-full"
                                        >
                                            <a-select-option v-for="_size in product.sizes" :key="_size.value" :value="_size.value">
                                                {{ SIZE_LABEL[_size.value] }}
                                            </a-select-option>
                                        </a-select>
                                    </a-form-model-item>
                                </div>
                            </div>

                            <div v-if="product.toppings && product.toppings.length > 0" class="mt-4">
                                <h4 class="text-xl font-semibold">
                                    Thêm vào
                                </h4>

                                <div>
                                    <div class="grid grid-cols-2 gap-5">
                                        <div v-for="topping, index in product.toppings" :key="index" class="inline-flex p-[10px] w-full rounded-[10px] items-center border border-[#2222221a]">
                                            <div class="flex justify-between items-center w-full">
                                                <div>
                                                    <p class="font-medium mb-0 text-base">
                                                        {{ TOPPING_LABEL[topping.value] }}
                                                    </p>
                                                    <p class="mb-0 text-base">
                                                        {{ topping.price | currencyFormat }}
                                                    </p>
                                                </div>
                                                <div>
                                                    <a-checkbox @change="(isCheck) => changetoppings(isCheck, topping.value)" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="flex gap-10 mt-4">
                                <div>
                                    <h3 class="text-lg font-medium leading-[22px]">
                                        Giá tiền
                                    </h3>
                                    <h2 class="text-3xl mt-3">
                                        <span v-if="product.discount" class="line-through italic text-gray-60 font-light">{{ calculatePriceProduct.total_price | currencyFormat }}</span>
                                        <span class="font-semibold text-primary-100">{{ calculatePriceProduct.final_price | currencyFormat }}</span>
                                    </h2>
                                </div>
                                <div>
                                    <h3 class="text-lg font-medium leading-[22px]">
                                        Số lượnng
                                    </h3>
                                    <div class="bg-[#eaeaea] p-1 rounded-sm w-auto inline-block">
                                        <div class="flex items-center justify-between space-x-5 w-full">
                                            <div class="flex items-center justify-between w-[104px] sm:w-28">
                                                <button
                                                    class="w-7 h-7 rounded-sm flex items-center justify-center border border-transparent bg-white focus:outline-none hover:border-neutral-700 disabled:hover:border-neutral-400 disabled:opacity-50 disabled:cursor-default"
                                                    type="button"
                                                    :disabled="countProduct <= 1"
                                                    @click="changeCount(-1)"
                                                >
                                                    <span class="text-3xl">-</span>
                                                </button>
                                                <span class="select-none block flex-1 text-center leading-none">{{ countProduct }}</span>
                                                <button
                                                    class="w-7 h-7 rounded-sm flex items-center justify-center border border-transparent bg-white focus:outline-none hover:border-neutral-700 disabled:hover:border-neutral-400 disabled:opacity-50 disabled:cursor-default"
                                                    type="button"
                                                    :disabled="countProduct >= 10"
                                                    @click="changeCount(1)"
                                                >
                                                    <span class="text-3xl">+</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="flex items-center gap-5 mt-4">
                                <span
                                    class="inline-block px-6 py-3 font-normal border-[1px] border-secondary-100 border-solid text-white  rounded transition-all duration-300 bg-secondary-100 hover:bg-transparent hover:text-secondary-100 cursor-pointer"
                                    @click="checkoutNow"
                                >
                                    Mua ngay
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </a-modal>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { mapDataFromOptions } from '@/utils/data';
    import { SIZE_OPTIONS } from '@/constants/products/size';
    import { TOPPINGS } from '@/constants/products/toppings';
    import { OPTIONS } from '@/constants/products/options';

    export default {
        data() {
            return {
                visible: false,
                product: null,

                countProduct: 1,
                option: undefined,
                size: undefined,
                toppings: [],
            };
        },

        computed: {
            ...mapGetters('products', ['useCart']),
            OPTION_LABEL() {
                return mapDataFromOptions(OPTIONS, 'value', 'label');
            },
            SIZE_LABEL() {
                return mapDataFromOptions(SIZE_OPTIONS, 'value', 'label');
            },
            TOPPING_LABEL() {
                return mapDataFromOptions(TOPPINGS, 'value', 'label');
            },

            isExsistProduct() {
                return this.useCart.cart.find((item) => this.product && item.value === this.product.id);
            },

            calculatePriceProduct() {
                if (this.product && this.product.id) {
                    const priceOfOption = this.product.sizes.find((_size) => _size.value === this.size)?.price || 0;
                    const priceOfSize = this.product.options.find((_options) => _options.value === this.option)?.price || 0;
                    const beforePrice = this.product.price;
                    const discount = this.product.discount;

                    let toppingPrice = 0;
                    if (this.toppings && this.toppings.length > 0) {
                        this.toppings.map((topping) => {
                            const result = this.product.toppings && this.product.toppings.find((element) => element.value === topping);
                            if (result) {
                                toppingPrice += result.price;
                            }
                            return topping;
                        });
                    }
                    const total_price = priceOfSize + beforePrice + priceOfOption + toppingPrice;
                    return {
                        total_price,
                        final_price: total_price - ((total_price / 100) * discount),
                    };
                }
                return {
                    total_price: 0,
                    final_price: 0,
                };
            },
        },

        methods: {
            open(product) {
                this.product = product;
                this.visible = true;
            },

            close() {
                this.visible = false;
            },

            changeCount(value) {
                this.countProduct += value;
            },

            changetoppings(isCheck, value) {
                if (isCheck.target.checked) {
                    this.toppings = [...this.toppings, value];
                } else {
                    this.toppings = this.toppings.filter((topping) => topping !== value);
                }
            },

            checkoutNow() {
                if (!this.size) this.$message.error('Kích cỡ bánh là lựa chọn bắt buộc');
                this.$store.dispatch('products/addProductToCart', {
                    id: Date.now(),
                    product_id: this.product.id,
                    product: this.product,
                    type: 'PRODUCT',
                    size: this.size,
                    option: this.option,
                    toppings: this.toppings,
                    count: this.countProduct,
                    total_price: this.calculatePriceProduct.final_price,
                });
                this.$router.push('thanh-toan');
            },
        },
    };
</script>
