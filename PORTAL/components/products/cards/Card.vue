<template>
    <div>
        <div v-if="productVarible" class="group rounded-[10px] bg-white relative h-full duration-200 overflow-hidden z-[1] border-[1px] border-solid border-gray-20">
            <div class="relative overflow-hidden h-[200px]">
                <img :src="productVarible.thumbnail" alt="/" class="group-hover:scale-110 duration-300 h-full w-full object-cover">
            </div>
            <div class="flex flex-col py-3 lg:px-5 px-[15px]">
                <nuxt-link :to="`/san-pham/${productVarible.id}`">
                    <h5 class="text-2xl font-medium hover:text-primary-100 cursor-pointer transition-all duration-300 mb-2">
                        {{ productVarible.product_name }}
                    </h5>
                </nuxt-link>
                <p class="mb-[10px] text-sm">
                    {{ productVarible.description }}
                </p>
                <div class=" items-center justify-between">
                    <div class="grid grid-cols-1 produt-card">
                        <a-form-model-item
                            v-if="productVarible.options && productVarible.options.length > 0"
                            label="Lựa chọn"
                            class="!mb-0"
                            size="small"
                        >
                            <a-select
                                v-model="option"
                                placeholder="Lựa chọn"
                                class="w-full"
                                @change="(value) => changeSelectType('option', value)"
                            >
                                <a-select-option v-for="_option in productVarible.options" :key="_option.option_value" :value="_option.option_value">
                                    {{ OPTION_LABEL[_option.option_value] }}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item
                            v-if="productVarible.sizes && productVarible.sizes.length > 0"
                            label="Chọn Size"
                            class="!mb-0"
                            size="small"
                        >
                            <a-select
                                v-model="size"
                                placeholder="Size bánh"
                                class="w-full"
                                @change="(value) => changeSelectType('size', value)"
                            >
                                <a-select-option v-for="_size in productVarible.sizes" :key="_size.size_value" :value="_size.size_value">
                                    {{ SIZE_LABEL[_size.size_value] }}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item
                            v-if="productVarible.toppings && productVarible.toppings.length > 0"
                            label="toppings"
                            class="!mb-0"
                            size="small"
                        >
                            <a-select
                                v-model="toppings"
                                mode="multiple"
                                placeholder="Thêm topping"
                                class="w-full"
                                @change="(value) => changeSelectType('toppings', value)"
                            >
                                <a-select-option v-for="_topping in productVarible.toppings" :key="_topping.topping_value" :value="_topping.topping_value">
                                    {{ TOPPING_LABEL[_topping.topping_value] }}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </div>
                    <div class="mt-3 flex justify-between items-center">
                        <div>
                            <div class="flex items-center gap-2">
                                <span v-if="productVarible.discount" class="block text-xl line-through italic text-gray-60 font-light">{{ calculatePrice.total_price | currencyFormat }}</span>
                                <span v-if="productVarible.discount" class="italic font-light">Giảm giá ~ {{ productVarible.discount }}%</span>
                            </div>
                            <span class="block price text-2xl font-semibold text-primary-100">{{ calculatePrice.final_price | currencyFormat }}</span>
                        </div>
                        <span
                            class="inline-block px-6 py-3 font-normal border-[1px] border-primary-100 border-solid text-white  rounded transition-all duration-300 bg-primary-100 hover:bg-transparent hover:text-primary-100 cursor-pointer"
                            @click="buyNow"
                        >
                            Mua ngay
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <BuyNowDialog ref="BuyNowDialog" />
        <RequestLoginDialog ref="RequestLoginDialog" />
    </div>
</template>

<script>
    import _cloneDeep from 'lodash/cloneDeep';
    import BuyNowDialog from '@/components/shared/BuyNowDialog.vue';
    import RequestLoginDialog from '@/components/shared/RequestLoginDialog.vue';
    import { OPTIONS } from '@/constants/products/options';
    import { mapDataFromOptions } from '@/utils/data';
    import { SIZE_OPTIONS } from '@/constants/products/size';
    import { TOPPINGS } from '@/constants/products/toppings';

    export default {
        components: {
            BuyNowDialog,
            RequestLoginDialog,
        },

        props: {
            product: {
                type: Object,
                default: () => {},
            },
        },

        data() {
            return {
                OPTIONS,
                option: null,
                size: null,
                toppings: [],
                productVarible: null,
            };
        },

        computed: {
            OPTION_LABEL() {
                return mapDataFromOptions(OPTIONS, 'value', 'label');
            },
            SIZE_LABEL() {
                return mapDataFromOptions(SIZE_OPTIONS, 'value', 'label');
            },
            TOPPING_LABEL() {
                return mapDataFromOptions(TOPPINGS, 'value', 'label');
            },

            calculatePrice() {
                const priceOfOption = this.product.options.find((_options) => _options.option_value === this.option)?.price || 0;
                const priceOfSize = this.product.sizes.find((_size) => _size.size_value === this.size)?.price || 0;
                const discount = this.product.discount;

                let toppingPrice = 0;
                if (this.product && this.product.toppings && this.product.toppings.length > 0) {
                    this.toppings.map((topping) => {
                        const result = this.product.toppings && this.product.toppings.find((element) => element.topping_value === topping);
                        if (result) {
                            toppingPrice += result.price;
                        }
                        return topping;
                    });
                }
                const total_price = priceOfSize + priceOfOption + toppingPrice;
                return {
                    total_price: priceOfSize + priceOfOption + toppingPrice,
                    final_price: discount ? total_price - ((total_price / 100) * discount) : total_price,
                };
            },
        },

        mounted() {
            this.productVarible = _cloneDeep(this.product);
            this.option = this.productVarible.options && this.productVarible.options.length > 0 ? this.productVarible.options[0]?.option_value : undefined;
            this.size = this.productVarible.sizes && this.productVarible.sizes.length > 0 ? this.productVarible.sizes[0]?.size_value : undefined;
            this.toppings = this.productVarible.toppings && this.productVarible.toppings.length > 0 ? [this.productVarible.toppings[0]?.topping_value] : [];
            this.$forceUpdate();
        },

        methods: {
            buyNow() {
                if (this.$auth.user) {
                    if (!this.size) this.$message.error('Kích cỡ bánh là lựa chọn bắt buộc');
                    this.$store.dispatch('products/addProductToCart', {
                        id: Date.now(),
                        product_id: this.product.id,
                        product: this.product,
                        type: 'PRODUCT',
                        size: this.size,
                        option: this.option,
                        toppings: this.toppings,
                        count: 1,
                        total_price: this.calculatePrice.final_price,
                    });
                    this.$router.push('thanh-toan');
                } else {
                    this.$message.info('Đăng nhập để tiếp tục');
                    this.$refs.RequestLoginDialog.open();
                }
            },

            changeSelectType(key, value) {
                this[key] = value;
            },
        },
    };
</script>

<style lang="scss">
.produt-card {
    .ant-form-item {
        margin-bottom: 0px !important;
    }
}
</style>
