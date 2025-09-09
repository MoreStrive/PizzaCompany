<template>
    <div class="flex gap-4">
        <div class="w-[120px] h-[120px] bg-gray-5">
            <img :src="product.thumbnail || ''" class="w-full h-full object-cover rounded-md" alt="">
        </div>
        <div class="flex-1">
            <div>
                <h4 class="text-xl font-semibold mb-1 flex items-center gap-5">
                    {{ product.product_name || '' }}
                </h4>
                <div class="bg-[#eaeaea] p-1 rounded-sm w-auto inline-block">
                    <div class="flex items-center justify-between space-x-5 w-full">
                        <div class="flex items-center justify-between w-[104px] sm:w-28">
                            <button
                                class="w-7 h-7 rounded-sm flex items-center justify-center border border-transparent bg-white focus:outline-none hover:border-neutral-700 disabled:hover:border-neutral-400 disabled:opacity-50 disabled:cursor-default"
                                type="button"
                                :disabled="productInCombo.count <= 1 || !$permission.Admin()"
                                @click="changeCount(-1)"
                            >
                                <span class="text-3xl">-</span>
                            </button>
                            <span class="select-none block flex-1 text-center leading-none">{{ productInCombo.count }}</span>
                            <button
                                class="w-7 h-7 rounded-sm flex items-center justify-center border border-transparent bg-white focus:outline-none hover:border-neutral-700 disabled:hover:border-neutral-400 disabled:opacity-50 disabled:cursor-default"
                                type="button"
                                :disabled="productInCombo.count >= 10 || !$permission.Admin()"
                                @click="changeCount(1)"
                            >
                                <span class="text-3xl">+</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div class="grid grid-cols-3 gap-4">
                    <a-form-model-item v-if="product.options && product.options.length > 0" prop="" label="Lựa chọn">
                        <a-select
                            v-model="option"
                            placeholder="Lựa chọn"
                            :disabled="!$permission.Admin()"
                            @change="(value) => changeSelectType('option', value)"
                        >
                            <a-select-option v-for="_option in product.options" :key="_option.option_value" :value="_option.option_value">
                                {{ OPTION_LABEL[_option.option_value] }}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item v-if="product.sizes && product.sizes.length > 0" prop="" label="Chọn Size">
                        <a-select
                            v-model="size"
                            placeholder="Size bánh"
                            :disabled="!$permission.Admin()"
                            @change="(value) => changeSelectType('size', value)"
                        >
                            <a-select-option v-for="_size in product.sizes" :key="_size.size_value" :value="_size.size_value">
                                {{ SIZE_LABEL[_size.size_value] }}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item v-if="product.toppings && product.toppings.length > 0" prop="" label="Topings">
                        <a-select
                            v-model="toppings"
                            mode="multiple"
                            placeholder="Thêm topping"
                            :disabled="!$permission.Admin()"
                            @change="(value) => changeSelectType('toppings', value)"
                        >
                            <a-select-option v-for="_toping in product.toppings" :key="_toping.topping_value" :value="_toping.topping_value">
                                {{ TOPING_LABEL[_toping.topping_value] }}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                </div>
            </div>
        </div>
        <div class="flex flex-col items-center justify-end">
            <div>
                <h4 class="font-semibold text-primary-100 text-center">
                    Tạm tính: <br>
                    {{ productInCombo.total_price | currencyFormat }}
                </h4>
            </div>
            <div v-if="$permission.Admin()">
                <div class="social-icon !w-[40px] !h-[40px] !text-base text-white bg-danger-100 !shadow-none hover:!shadow-2xl" @click="removeProduct">
                    <i class="fas fa-trash" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
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

            productInCombo: {
                type: Object,
                default: () => {},
            },
        },

        data() {
            return {
                OPTIONS,
                option: undefined,
                size: undefined,
                toppings: [],
            };
        },

        computed: {
            OPTION_LABEL() {
                return mapDataFromOptions(OPTIONS, 'value', 'label');
            },
            SIZE_LABEL() {
                return mapDataFromOptions(SIZE_OPTIONS, 'value', 'label');
            },
            TOPING_LABEL() {
                return mapDataFromOptions(TOPPINGS, 'value', 'label');
            },
        },

        watch: {
            productInCombo() {
                const _temp = _cloneDeep(this.productInCombo);
                this.option = _temp.option;
                this.size = _temp.size;
                this.toppings = _temp.toppings;
                this.$forceUpdate();
            },
        },

        mounted() {
            const _temp = _cloneDeep(this.productInCombo);
            this.option = _temp.option;
            this.size = _temp.size;
            this.toppings = _temp.toppings;
            this.$forceUpdate();
        },

        methods: {
            _get,
            _cloneDeep,

            removeProduct() {
                this.$emit('remove', this.productInCombo, this.product);
            },

            changeSelectType(key, value) {
                this.$emit('change', key, value, this.productInCombo, this.product);
            },

            changeCount(value) {
                this.$emit('changeCount', value, this.productInCombo, this.product);
            },
        },
    };
</script>

<style lang="scss">
    .social-icon {
        @apply w-[50px] h-[50px] text-xl font-medium no-underline flex justify-center items-center shadow-lg cursor-pointer transition-all duration-300 m-1 rounded-full;
    }
</style>
