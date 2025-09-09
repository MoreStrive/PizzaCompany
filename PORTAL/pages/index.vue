<template>
    <main>
        <section class="h-screen bg-[url('/images/backgrounds/banner.jpg')] flex flex-col justify-center items-center">
            <div class="container">
                <div>
                    <h2 class="text-xl uppercase mb-0">
                        Xin chào!
                    </h2>
                    <h1 class="mb-2.5 text-black text-[80px] leading-[1.4] text-lobster">
                        Lựa chọn Thực phẩm<br><span class="text-primary-100"> chất lượng tốt nhất</span>
                    </h1>
                    <p class="max-w-[500px] lg:text-xl sm:text-base text-sm leading-[27px] mb-0">
                        Pizza là chuỗi nhà hàng pizza được yêu thích và lớn nhất thế giới. Pizza tự hào hiện diện tại 100 quốc gia trên khắp thế giới.
                    </p>

                    <nuxt-link to="/san-pham" class="inline-block mt-5 px-8 py-4 font-normal border-[1px] border-primary-100 border-solid !text-primary-100 rounded transition-all duration-300 bg-transparent hover:bg-primary-100 hover:!text-white cursor-pointer">
                        Đặt hàng ngay
                    </nuxt-link>
                </div>
            </div>
        </section>

        <section class="py-20">
            <div class="container">
                <div class="text-center flex justify-between items-center">
                    <h2 class="mb-2.5 text-black text-7xl leading-[1.4] text-lobster">
                        Từ menu của chúng tôi
                    </h2>

                    <nuxt-link to="/san-pham" class="inline-block px-6 py-3 font-normal border-[1px] border-primary-100 border-solid !text-white  rounded transition-all duration-300 bg-primary-100 hover:bg-transparent hover:!text-primary-100 cursor-pointer">
                        Xem thêm
                    </nuxt-link>
                </div>

                <div>
                    <MenuSlide :data="products" />
                </div>
            </div>
        </section>

        <section class="py-20 bg-primary-10">
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
                        class="rounded-[10px] shadow-lg duration-500 relative z-[1] overflow-hidden group hover:after:opacity-100 after:content-['']
                        after:absolute after:z-0 z-0 after:opacity-0 after:w-full after:h-full after:transition-all after:duration-[0.5s] after:z-[1]
                        after:left-0 after:top-0 after:bg-gradient-to-t after:from-primary-100"
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
                            </div>
                        </div>
                    </div>
                </div>

                <div class="text-center mt-10">
                    <nuxt-link
                        to="/san-pham"
                        class="inline-block mt-5 px-6 py-3 font-normal border-[1px] border-primary-100 border-solid !text-white  rounded transition-all duration-300 bg-primary-100 hover:bg-transparent hover:!text-primary-100 cursor-pointer"
                    >
                        Xem tất cả
                    </nuxt-link>
                </div>
            </div>
        </section>

        <section class="bg-[url('https://swigo.dexignzone.com/tailwind/xhtml/assets/images/background/pic1.png')] py-20 bg-cover bg-center bg-no-repeat bg-fixed relative z-[2] after:content-[''] after:absolute after:z-[-1] after:bg-black-blur after:opacity-100 after:w-full after:h-full after:top-0 after:left-0 after:backdrop-blur-[6px]">
            <div class="container">
                <div class="text-center">
                    <h2 class="text-7xl leading-[1.4] text-lobster text-white">
                        Liên hệ với chúng tôi
                    </h2>
                </div>

                <div class="mt-10">
                    <ContactForm />
                </div>
            </div>
        </section>

        <section class="h-[350px] md:h-[600px]" v-html="setting.map" />
    </main>
</template>

<script>
    import { mapState } from 'vuex';
    import MenuSlide from '@/components/products/MenuSlide.vue';
    import ContactForm from '@/components/home/OrderForm.vue';

    export default {
        components: {
            MenuSlide,
            ContactForm,
        },

        async fetch() {
            await this.fetchData();
        },

        data() {
            return {};
        },

        computed: {
            ...mapState('products', ['products']),
            ...mapState('combos', ['combos']),
            ...mapState('settings', ['setting']),
        },

        methods: {
            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('products/fetchAll', this.$route.query);
                    await this.$store.dispatch('combos/fetchAll', this.$route.query);
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },
    };
</script>

<style lang="scss">
    iframe {
        @apply w-full h-full #{!important}
    }
</style>
