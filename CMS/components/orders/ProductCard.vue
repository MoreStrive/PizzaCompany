<template>
    <div>
        <template v-if="product.type === 'PRODUCT'">
            <div v-if="product" class="flex gap-4">
                <div class="w-[120px] h-[120px] bg-gray-5">
                    <img :src="_get(product, 'product.thumbnail', '')" class="w-full h-full object-cover rounded-md" alt="">
                </div>
                <div class="flex-1">
                    <div>
                        <h4 class="text-xl font-semibold mb-1">
                            {{ _get(product, 'product.product_name', '') }}
                        </h4>
                    </div>
                    <div class="mt-2">
                        <div class="grid grid-cols-1 gap-y-1">
                            <p v-if="_get(product, 'option', '')" class="text-sm mb-0">
                                <span class="font-semibold">Lựa chọn: </span>
                                {{ OPTION_LABEL[_get(product, 'option', '')] }}
                            </p>
                            <p v-if="_get(product, 'size', '')" class="text-sm mb-0">
                                <span class="font-semibold">Size bánh: </span>
                                {{ SIZE_LABEL[_get(product, 'size', '')] }}
                            </p>
                            <p v-if="_get(product, 'toppings', '') && _get(product, 'toppings', []).length > 0" class="text-sm mb-0">
                                <span class="font-semibold">Toppings: </span>
                                <span v-for="topping, index in _get(product, 'toppings', [])" :key="index">
                                    {{ index === 0 ? TOPPING_LABEL[topping] : ', ' + TOPPING_LABEL[topping] }}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div class="flex items-center justify-between mt-2">
                        <p class="mb-0">
                            <span class="font-semibold">Số lượng:</span>
                            {{ _get(product, 'count', 1) }}
                        </p>
                        <h4 class="font-semibold text-primary-100 text-center mb-0">
                            {{ _get(product, 'total_price', 0) | currencyFormat }}
                        </h4>
                    </div>
                </div>
            </div>
        </template>
        <template v-if="product.type === 'COMBO'">
            <div v-if="product" class="flex gap-4">
                <div class="w-[120px] h-[120px] bg-gray-5">
                    <img :src="_get(product, 'combo.thumbnail', '')" class="w-full h-full object-cover rounded-md" alt="">
                </div>
                <div class="flex-1">
                    <div>
                        <h4 class="text-xl font-semibold mb-1">
                            {{ _get(product, 'combo.title', '') }}
                        </h4>
                    </div>
                    <div class="grid grid-cols-1 gap-2 mt-2">
                        <div v-for="_product in product.combo.combo_products" :key="_product.id">
                            <h3 class="mb-0">
                                {{ _get(_product, 'product.product_name', '') }} x {{ _product.count }}
                            </h3>
                            <p class="mb-0">
                                <template v-if="_get(_product, 'option', '')">
                                    {{ OPTION_LABEL[_get(_product, 'option', '')] }},
                                </template>
                                <template v-if="_get(_product, 'size', '')">
                                    {{ SIZE_LABEL[_get(_product, 'size', '')] }}
                                </template>
                                <span v-for="topping, index in _get(_product, 'toppings', '')" :key="index">{{ TOPPING_LABEL[topping] + ', ' }}</span>
                            </p>
                        </div>
                    </div>

                    <div class="flex items-center justify-between mt-2">
                        <p class="mb-0">
                            <span class="font-semibold">Số lượng:</span>
                            {{ product.count }}
                        </p>
                        <h4 class="font-semibold text-primary-100 text-center mb-0">
                            {{ product.total_price | currencyFormat }}
                        </h4>
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
            product: {
                type: Object,
                default: () => {},
            },

            orderItem: {
                type: Object,
                default: () => {},
            },
        },

        data() {
            return {
                OPTIONS,
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
            productInCombo() {
                return (product) => this.products.find((element) => element.id === product.value);
            },
        },

        methods: {
            _get,
            _cloneDeep,
        },
    };
</script>

<style lang="scss">
    .social-icon {
        @apply w-[50px] h-[50px] text-xl font-medium no-underline flex justify-center items-center shadow-lg cursor-pointer transition-all duration-300 m-1 rounded-full;
    }
</style>
