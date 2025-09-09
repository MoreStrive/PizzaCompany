<template>
    <main>
        <section class="h-[400px] bg-[url('https://swigo.dexignzone.com/tailwind/xhtml/assets/images/background/pic1.png')] after:bg-[#222222e6] py-20 bg-cover bg-center bg-no-repeat bg-fixed relative z-[2] after:content-[''] after:absolute after:z-[-1] after:bg-black-blur after:opacity-100 after:w-full after:h-full after:top-0 after:left-0 after:backdrop-blur-[6px] flex flex-col justify-center">
            <div class="container">
                <div class="text-center">
                    <h2 class="text-7xl leading-[1.4] text-lobster text-white">
                        Combo nóng hổi
                    </h2>
                </div>
            </div>
        </section>

        <section class="py-20">
            <div class="container">
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
                                    <div class="flex flex-col">
                                        <span class="price text-2xl font-semibold text-primary-100 block">{{ combo.final_price | currencyFormat }}</span>
                                        <span v-if="combo.discount" class="italic font-light">Giảm giá ~ {{ combo.discount }}%</span>
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

                <ReviewProduct :comments="comments" />
            </div>
        </section>

        <section class="pb-20">
            <div class="container">
                <div class="text-center">
                    <h2 class="mb-2.5 text-black text-7xl leading-[1.4] text-lobster">
                        Combo nóng hổi
                    </h2>
                </div>

                <div class="grid grid-cols-4 gap-6 mt-8">
                    <div
                        v-for="combo in combos"
                        :key="combo.id"
                        class="rounded-[10px] shadow-lg duration-500 relative z-[1] overflow-hidden group hover:after:opacity-100 after:content-[''] after:absolute after:z-0 z-0 after:opacity-0 after:w-full after:h-full after:transition-all after:duration-[0.5s] after:z-[1] after:left-0 after:top-0 after:bg-gradient-to-t after:from-primary-100"
                    >
                        <div class="w-full min-w-full h-[400px]">
                            <img :src="combo.thumbnail" alt="" class="w-full h-full object-cover block">
                        </div>
                        <span class="absolute top-0 bg-secondary-100 left-0 text-white uppercase py-[4px] px-2.5 font-semibold text-xs leading-[18px] z-[2]">Bán chạy</span>
                        <div class="text-center content bg-white py-[23px] px-[15px] block duration-500 absolute w-full bottom-0 mb-0 group-hover:bottom-[-150px] group-hover:opacity-0">
                            <nuxt-link :to="`/combo/${combo.id}`">
                                <h4 class="mb-1 text-2xl font-semibold">
                                    {{ combo.title }}
                                </h4>
                            </nuxt-link>
                            <p class="mb-[2px]">
                                {{ combo.content }}
                            </p>
                        </div>
                        <div class="hover-content flex justify-between py-5 px-[30px] absolute bottom-0 opacity-0 z-[2] w-full items-center duration-500 mb-[-100px] group-hover:mb-0 group-hover:opacity-100">
                            <div class="info relative">
                                <nuxt-link :to="`/combo/${combo.id}`">
                                    <h4 class="mb-1 text-3xl font-semibold text-white">
                                        {{ combo.title }}
                                    </h4>
                                </nuxt-link>
                                <div class="flex items-center gap-4">
                                    <span class="price text-xl font-semibold text-secondary-100 block">{{ combo.final_price | currencyFormat }}</span>
                                    <span v-if="combo.discount" class="italic font-light text-white">Giảm giá ~ {{ combo.discount }}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <RequestLoginDialog ref="RequestLoginDialog" />
    </main>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';
    import { mapDataFromOptions } from '@/utils/data';
    import { SIZE_OPTIONS } from '@/constants/products/size';
    import { TOPPINGS } from '@/constants/products/toppings';
    import { OPTIONS } from '@/constants/products/options';
    import ReviewProduct from '@/components/shared/ReviewProduct.vue';
    import RequestLoginDialog from '@/components/shared/RequestLoginDialog.vue';
    import _get from 'lodash/get';

    export default {
        components: {
            ReviewProduct,
            RequestLoginDialog,
        },

        async fetch() {
            await this.fetchData();
        },

        data() {
            return {
                countCombo: 1,
                option: null,
                size: null,
                toppings: [],
            };
        },

        computed: {
            ...mapState('combos', ['combos', 'combo']),
            ...mapState('products', ['products']),
            ...mapGetters('products', ['useCart']),
            ...mapState('products/comments', ['comments', 'ratingAVG', 'pagination']),

            OPTION_LABEL() {
                return mapDataFromOptions(OPTIONS, 'value', 'label');
            },
            SIZE_LABEL() {
                return mapDataFromOptions(SIZE_OPTIONS, 'value', 'label');
            },
            TOPPING_LABEL() {
                return mapDataFromOptions(TOPPINGS, 'value', 'label');
            },

            isExsistCombo() {
                return this.useCart.cart.find((item) => this.combo && item.value === this.combo.id);
            },
        },

        methods: {
            _get,
            async fetchData() {
                try {
                    await this.$store.dispatch('products/fetchAll');
                    await this.$store.dispatch('combos/fetchDetail', this.$route.params.id);
                    await this.$store.dispatch('combos/fetchAll');
                    await this.$store.dispatch('products/comments/fetchAll', { id: this.$route.params.id, params: this.$route.query });
                } catch (error) {
                    this.$handleError(error);
                }
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
                if (this.$auth.user) {
                    this.$store.dispatch('products/addProductToCart', {
                        id: Date.now(),
                        combo_id: this.combo.id,
                        combo: this.combo,
                        type: 'COMBO',
                        count: this.countCombo,
                        total_price: this.countCombo * this.combo.total_price,
                    });
                    this.$router.push('/thanh-toan');
                } else {
                    this.$message.info('Đăng nhập để tiếp tục');
                    this.$refs.RequestLoginDialog.open();
                }
            },
        },
    };
</script>

<style lang="scss">
.ant-tabs-tab {
    @apply text-lg
}
</style>
