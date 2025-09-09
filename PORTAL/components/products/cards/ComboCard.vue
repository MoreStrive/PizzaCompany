<template>
    <div class="">
        <div class="group rounded-[10px] bg-white relative duration-200 overflow-hidden z-[1] border-[1px] border-solid border-gray-20">
            <div class="relative overflow-hidden h-[200px]">
                <img :src="combo.thumbnail" alt="/" class="group-hover:scale-110 duration-300 h-full w-full object-cover">
            </div>
            <div class="flex flex-col py-3 lg:px-5 px-[15px]">
                <nuxt-link :to="`/combo/${combo.id}`">
                    <h5 class="text-2xl font-medium hover:text-primary-100 cursor-pointer transition-all duration-300 mb-0">
                        {{ combo.title }}
                    </h5>
                </nuxt-link>
                <p class="mb-[10px] text-sm">
                    {{ combo.content }}
                </p>

                <div class="grid grid-cols-1 gap-2">
                    <div v-for="product in combo && combo?.combo_products ? combo?.combo_products : []" :key="product.value">
                        <h3 class="mb-0">
                            {{ _get(product, 'product.product_name') }} x {{ product.count }}
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

                <div class="flex items-center justify-between mt-4">
                    <div>
                        <span class="price text-2xl font-semibold text-primary-100 block">{{ combo.final_price | currencyFormat }}</span>
                        <span v-if="combo.discount" class="italic font-light">Giảm giá ~ {{ combo.discount }}%</span>
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

        <BuyComBoDialog ref="BuyComBoDialog" />
        <RequestLoginDialog ref="RequestLoginDialog" />
    </div>
</template>

<script>
    import _get from 'lodash/get';
    import { mapState } from 'vuex';
    import { mapDataFromOptions } from '@/utils/data';
    import { SIZE_OPTIONS } from '@/constants/products/size';
    import { TOPPINGS } from '@/constants/products/toppings';
    import { OPTIONS } from '@/constants/products/options';
    import RequestLoginDialog from '@/components/shared/RequestLoginDialog.vue';
    import BuyComBoDialog from '@/components/shared/BuyComBoDialog.vue';

    export default {
        components: {
            BuyComBoDialog,
            RequestLoginDialog,
        },

        props: {
            combo: {
                type: Object,
                default: () => {},
            },
        },

        data() {
            return {};
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

        methods: {
            _get,

            buyNow() {
                if (this.$auth.user) this.$refs.BuyComBoDialog.open(this.combo);
                else {
                    this.$message.info('Đăng nhập để tiếp tục');
                    this.$refs.RequestLoginDialog.open();
                }
            },
        },
    };
</script>
