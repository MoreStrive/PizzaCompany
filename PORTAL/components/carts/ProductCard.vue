<template>
    <div>
        <template v-if="cartItem.type === 'PRODUCT'">
            <div v-if="product" class="flex gap-4">
                <div v-if="product.thumbnail" class="w-[120px] h-[120px] bg-gray-5">
                    <img :src="product.thumbnail || ''" class="w-full h-full object-cover rounded-md" alt="">
                </div>
                <div class="flex-1">
                    <div>
                        <h4 class="text-xl font-semibold mb-1 flex items-center gap-5">
                            {{ product.product_name || '' }}
                            <div>
                                <div class="bg-[#eaeaea] p-1 rounded-sm w-auto inline-block">
                                    <div class="flex items-center justify-between space-x-5 w-full">
                                        <div class="flex items-center justify-between w-[104px] sm:w-28">
                                            <button
                                                class="w-7 h-7 rounded-sm flex items-center justify-center border border-transparent bg-white focus:outline-none hover:border-neutral-700 disabled:hover:border-neutral-400 disabled:opacity-50 disabled:cursor-default"
                                                type="button"
                                                :disabled="cartItem.count <= 1"
                                                @click="changeCount(-1)"
                                            >
                                                <span class="text-3xl">-</span>
                                            </button>
                                            <span class="select-none block flex-1 text-center leading-none">{{ cartItem.count }}</span>
                                            <button
                                                class="w-7 h-7 rounded-sm flex items-center justify-center border border-transparent bg-white focus:outline-none hover:border-neutral-700 disabled:hover:border-neutral-400 disabled:opacity-50 disabled:cursor-default"
                                                type="button"
                                                :disabled="cartItem.count >= 10"
                                                @click="changeCount(1)"
                                            >
                                                <span class="text-3xl">+</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </h4>
                    </div>
                    <div class="pt-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div v-if="product.options && product.options.length > 0">
                                <h3 class="text-lg font-medium leading-[22px]">
                                    Lựa chọn
                                </h3>
                                <a-select
                                    v-model="option"
                                    class="w-full"
                                    placeholder="Lựa chọn"
                                    @change="(value) => changeSelectType('option', value)"
                                >
                                    <a-select-option v-for="_option in product.options" :key="_option.option_value" :value="_option.option_value">
                                        {{ OPTION_LABEL[_option.option_value] }}
                                    </a-select-option>
                                </a-select>
                            </div>
                            <div v-if="product.sizes && product.sizes.length > 0">
                                <h3 class="text-lg font-medium leading-[22px]">
                                    Chọn Size
                                </h3>
                                <a-select
                                    v-model="size"
                                    class="w-full"
                                    placeholder="Size bánh"
                                    @change="(value) => changeSelectType('size', value)"
                                >
                                    <a-select-option v-for="_size in product.sizes" :key="_size.size_value" :value="_size.size_value">
                                        {{ SIZE_LABEL[_size.size_value] }}
                                    </a-select-option>
                                </a-select>
                            </div>
                            <div
                                v-if="product.toppings && product.toppings.length > 0"
                                class="col-span-2"
                            >
                                <h3 class="text-lg font-medium leading-[22px]">
                                    Toppings
                                </h3>
                                <a-select
                                    v-model="toppings"
                                    class="w-full"
                                    mode="multiple"
                                    placeholder="Thêm topping"
                                    @change="(value) => changeSelectType('toppings', value)"
                                >
                                    <a-select-option v-for="_topping in product.toppings" :key="_topping.topping_value" :value="_topping.topping_value">
                                        {{ TOPPING_LABEL[_topping.topping_value] }}
                                    </a-select-option>
                                </a-select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col items-center">
                    <div>
                        <h4 class="font-semibold text-primary-100 text-center">
                            Tạm tính: <br>
                            {{ cartItem.total_price || 0 | currencyFormat }}
                        </h4>
                    </div>
                    <div>
                        <div class="social-icon !w-[40px] !h-[40px] !text-base text-white bg-danger-100 !shadow-none hover:!shadow-2xl" @click="removeProduct">
                            <i class="fas fa-trash" />
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-if="cartItem.type === 'COMBO'">
            <div class="flex gap-4">
                <div v-if="cartItem.combo.thumbnail" class="w-[120px] h-[120px] bg-gray-5">
                    <img :src="cartItem.combo.thumbnail || ''" class="w-full h-full object-cover rounded-md" alt="">
                </div>
                <div class="flex-1">
                    <div>
                        <h4 class="text-xl font-semibold mb-1 flex items-center gap-5">
                            {{ cartItem.combo.title || '' }}
                            <div>
                                <div class="bg-[#eaeaea] p-1 rounded-sm w-auto inline-block">
                                    <div class="flex items-center justify-between space-x-5 w-full">
                                        <div class="flex items-center justify-between w-[104px] sm:w-28">
                                            <button
                                                class="w-7 h-7 rounded-sm flex items-center justify-center border border-transparent bg-white focus:outline-none
                                                    hover:border-neutral-700 disabled:hover:border-neutral-400 disabled:opacity-50 disabled:cursor-default"
                                                type="button"
                                                :disabled="cartItem.count <= 1"
                                                @click="changeCount(-1)"
                                            >
                                                <span class="text-3xl">-</span>
                                            </button>
                                            <span class="select-none block flex-1 text-center leading-none">{{ cartItem.count }}</span>
                                            <button
                                                class="w-7 h-7 rounded-sm flex items-center justify-center border border-transparent bg-white focus:outline-none
                                                    hover:border-neutral-700 disabled:hover:border-neutral-400 disabled:opacity-50 disabled:cursor-default"
                                                type="button"
                                                :disabled="cartItem.count >= 10"
                                                @click="changeCount(1)"
                                            >
                                                <span class="text-3xl">+</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </h4>
                        <div v-if="products && products.length > 0" class="grid grid-cols-1 gap-2 mt-4">
                            <div v-for="_product in cartItem.combo && cartItem.combo?.combo_products ? cartItem.combo?.combo_products : []" :key="_product.value">
                                <h3 class="mb-0">
                                    {{ _get(_product, 'product.product_name', '') }} x {{ _product.count }}
                                </h3>
                                <p class="mb-0">
                                    <template v-if="_product.option">
                                        {{ OPTION_LABEL[_product.option] }},
                                    </template>
                                    <template v-if="_product.size">
                                        {{ SIZE_LABEL[_product.size] }}
                                    </template>
                                    <span v-for="topping, index in _product.toppings" :key="index">{{ ', ' + TOPPING_LABEL[topping] }}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col items-center">
                    <div>
                        <h4 class="font-semibold text-primary-100 text-center">
                            Tạm tính: <br>
                            {{ cartItem.total_price || 0 | currencyFormat }}
                        </h4>
                    </div>
                    <div>
                        <div class="social-icon !w-[40px] !h-[40px] !text-base text-white bg-danger-100 !shadow-none hover:!shadow-2xl" @click="removeProduct">
                            <i class="fas fa-trash" />
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import _get from 'lodash/get';
    import _cloneDeep from 'lodash/cloneDeep';
    import { mapDataFromOptions } from '@/utils/data';
    import { SIZE_OPTIONS } from '@/constants/products/size';
    import { TOPPINGS } from '@/constants/products/toppings';
    import { OPTIONS } from '@/constants/products/options';

    export default {
        props: {
            cartItem: {
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

                product: null,
            };
        },

        computed: {
            ...mapState('products', ['products']),
            OPTION_LABEL() {
                return mapDataFromOptions(OPTIONS, 'value', 'label');
            },
            SIZE_LABEL() {
                return mapDataFromOptions(SIZE_OPTIONS, 'value', 'label');
            },
            TOPPING_LABEL() {
                return mapDataFromOptions(TOPPINGS, 'value', 'label');
            },
        },

        watch: {
            cartItem() {
                const _temp = _cloneDeep(this.cartItem);
                this.option = _temp.option;
                this.size = _temp.size;
                this.toppings = _temp.toppings;
                this.$forceUpdate();

                this.product = this.cartItem?.product;
            },
        },

        mounted() {
            const _temp = _cloneDeep(this.cartItem);
            this.option = _temp.option;
            this.size = _temp.size;
            this.toppings = _temp.toppings;
            this.$forceUpdate();

            this.product = this.cartItem?.product;
        },

        methods: {
            _get,
            _cloneDeep,

            removeProduct() {
                this.$store.dispatch('products/removeProductToCart', this.cartItem);
            },

            changeSelectType(type, newValue) {
                this.$store.dispatch('products/changeOptionItemInCart', { value: this.cartItem.id, type, newValue });
            },

            changeCount(newValue) {
                this.$store.dispatch('products/changeCountProduct', { value: this.cartItem.id, count: newValue });
            },
        },
    };
</script>

<style lang="scss">
    .social-icon {
        @apply w-[50px] h-[50px] text-xl font-medium no-underline flex justify-center items-center shadow-lg cursor-pointer transition-all duration-300 m-1 rounded-full;
    }
</style>
