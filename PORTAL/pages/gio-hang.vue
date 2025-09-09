<template>
    <main>
        <section class="h-[400px] bg-[url('https://swigo.dexignzone.com/tailwind/xhtml/assets/images/background/pic1.png')] after:bg-[#222222e6] py-20 bg-cover bg-center bg-no-repeat bg-fixed relative z-[2] after:content-[''] after:absolute after:z-[-1] after:bg-black-blur after:opacity-100 after:w-full after:h-full after:top-0 after:left-0 after:backdrop-blur-[6px] flex flex-col justify-center">
            <div class="container">
                <div class="text-center">
                    <h2 class="text-7xl leading-[1.4] text-lobster text-white">
                        Giỏ hàng
                    </h2>
                </div>
            </div>
        </section>
        <div class="container py-10 lg:pt-20 lg:pb-40">
            <div class="flex flex-col lg:flex-row">
                <div class="w-full lg:w-[60%] xl:w-[55%] divide-y divide-graborder-gray-40">
                    <div class="grid grid-cols-1 gap-8">
                        <ProductInCart v-for="cartItem in useCart.cart" :key="cartItem.id" :cart-item="cartItem" />
                    </div>
                </div>

                <div class="border-t lg:border-t-0 lg:border-l border-gray-40 my-10 lg:my-0 lg:mx-10 xl:mx-16 2xl:mx-20 flex-shrink-0" />
                <div class="flex-1">
                    <div class="inherit md:sticky top-10">
                        <h3 class="text-xl font-semibold">
                            Chi tiết đơn hàng
                        </h3>
                        <div class="mt-7 text-sm text-slate-500 divide-y divide-gray-40/70">
                            <div class="flex justify-between pb-4">
                                <span class="text-slate-800 text-lg">Số sản phẩm</span>
                                <span class="font-semibold text-lg">{{ useCart.countCart || 0 }} sản phẩm</span>
                            </div>
                            <div class="flex justify-between py-4">
                                <span class="text-slate-800 text-lg">Phí vận chuyển</span>
                                <span class="font-semibold text-lg text-primary-100">Miễn phí vận chuyển</span>
                            </div>
                            <div class="flex justify-between font-semibold text-base pt-4">
                                <span class="font-semibold text-lg">Thành tiền</span>
                                <span class="font-semibold text-lg">{{ useCart.finalCartPrice | currencyFormat }}</span>
                            </div>
                        </div>
                        <nuxt-link
                            class="relative h-auto inline-flex items-center justify-center rounded-full
                                    text-sm sm:text-base font-medium py-3 px-4 sm:py-3.5 sm:px-6
                                    bg-primary-100 !text-white hover:shadow-xl mt-8 w-full transition-all duration-300"
                            to="/thanh-toan"
                        >
                            Xác nhận
                        </nuxt-link>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
    import { mapGetters } from 'vuex';
    import ProductInCart from '@/components/carts/ProductCard.vue';

    export default {
        components: {
            ProductInCart,
        },

        async fetch() {
            await this.fetchData();
        },

        data() {
            return {
                loading: false,
            };
        },

        computed: {
            ...mapGetters('products', ['useCart']),
        },

        methods: {
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
        },
    };
</script>
