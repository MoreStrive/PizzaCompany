<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        title=""
        :footer="false"
        width="1200px"
    >
        <section v-if="combo">
            <div class="grid grid-cols-4 gap-8">
                <div class="col-span-2">
                    <div class="h-[550px]">
                        <img :src="combo && combo?.thumbnail" class="w-full h-[550px] object-cover rounded-md" alt="">
                    </div>
                </div>
                <div class="col-span-2">
                    <div>
                        <h1 class="text-4xl font-semibold">
                            {{ combo.title }}
                        </h1>
                        <p class="text-lg mt-2" v-html="combo.content" />

                        <div class="grid grid-cols-1 gap-4">
                            <div v-for="product in combo && combo?.combo_products ? combo?.combo_products : []" :key="product.value">
                                <div class="flex gap-3">
                                    <div class="w-[120px] h-[120px]">
                                        <img :src="_get(product, 'product.thumbnail', '')" class="w-full h-full object-cover rounded-md" :alt="_get(product, 'product.product_name', '')">
                                    </div>
                                    <div>
                                        <h3 class="mb-0">
                                            {{ _get(product, 'product.product_name', '') }} x {{ product.count }}
                                        </h3>
                                        <p class="mb-0">
                                            <template v-if="product.option">
                                                {{ OPTION_LABEL[product.option] }},
                                            </template>
                                            <template v-if="product.size">
                                                {{ SIZE_LABEL[product.size] }}
                                            </template>
                                            <span v-for="topping, index in product.toppings" :key="index">{{ ', ' + TOPPING_LABEL[topping] }}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex gap-10 mt-4">
                            <div>
                                <h3 class="text-lg font-medium leading-[22px]">
                                    Giá tiền
                                </h3>
                                <div>
                                    <span class="price text-2xl font-semibold text-primary-100 block">{{ combo.total_price | currencyFormat }}</span>
                                    <span v-if="combo.discount" class="italic font-light">Giảm giá ~ {{ combo.discount }}%</span>
                                </div>
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
                                                :disabled="countCombo <= 1"
                                                @click="changeCount(-1)"
                                            >
                                                <span class="text-3xl">-</span>
                                            </button>
                                            <span class="select-none block flex-1 text-center leading-none">{{ countCombo }}</span>
                                            <button
                                                class="w-7 h-7 rounded-sm flex items-center justify-center border border-transparent bg-white focus:outline-none hover:border-neutral-700 disabled:hover:border-neutral-400 disabled:opacity-50 disabled:cursor-default"
                                                type="button"
                                                :disabled="countCombo >= 10"
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
                                class="inline-block px-6 py-3 font-normal border-[1px] border-primary-100 border-solid text-white  rounded transition-all duration-300 bg-primary-100 hover:bg-transparent hover:text-primary-100 cursor-pointer"
                                @click="addComboToCart"
                            >
                                Thêm vào giỏ hàng
                            </span>

                            <span
                                class="inline-block px-6 py-3 font-normal border-[1px] border-secondary-100 border-solid text-white  rounded transition-all duration-300 bg-secondary-100 hover:bg-transparent hover:text-secondary-100 cursor-pointer"
                                @click="buyNow"
                            >
                                Mua ngay
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </a-modal>
</template>

<script>
    import { mapDataFromOptions } from '@/utils/data';
    import { SIZE_OPTIONS } from '@/constants/products/size';
    import { TOPPINGS } from '@/constants/products/toppings';
    import { OPTIONS } from '@/constants/products/options';
    import _get from 'lodash/get';

    export default {
        data() {
            return {
                visible: false,
                combo: null,

                countCombo: 1,
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
            TOPPING_LABEL() {
                return mapDataFromOptions(TOPPINGS, 'value', 'label');
            },
        },

        methods: {
            _get,
            open(combo) {
                this.combo = combo;
                this.visible = true;
            },

            close() {
                this.visible = false;
            },

            changeCount(value) {
                this.countCombo += value;
            },

            addComboToCart() {
                this.$store.dispatch('products/addProductToCart', {
                    id: Date.now(),
                    combo_id: this.combo.id,
                    combo: this.combo,
                    type: 'COMBO',
                    count: this.countCombo,
                    total_price: this.countCombo * this.combo.total_price,
                });
                this.$message.success('Thêm Combo vào giỏ hàng thành công');
            },

            buyNow() {
                this.$store.dispatch('products/addProductToCart', {
                    id: Date.now(),
                    combo_id: this.combo.id,
                    combo: this.combo,
                    type: 'COMBO',
                    count: this.countCombo,
                    total_price: this.countCombo * this.combo.total_price,
                });
                this.$router.push('/thanh-toan');
            },
        },
    };
</script>
