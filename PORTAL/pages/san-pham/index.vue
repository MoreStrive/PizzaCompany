<template>
    <main>
        <section class="h-[400px] bg-[url('https://swigo.dexignzone.com/tailwind/xhtml/assets/images/background/pic1.png')] after:bg-[#222222e6] py-20 bg-cover bg-center bg-no-repeat bg-fixed relative z-[2] after:content-[''] after:absolute after:z-[-1] after:bg-black-blur after:opacity-100 after:w-full after:h-full after:top-0 after:left-0 after:backdrop-blur-[6px] flex flex-col justify-center">
            <div class="container">
                <div class="text-center">
                    <h2 class="text-7xl leading-[1.4] text-lobster text-white">
                        What's up today?
                    </h2>
                </div>
            </div>
        </section>

        <section class="py-20">
            <div class="container">
                <div class="grid grid-cols-12 gap-5">
                    <div class="col-span-12">
                        <a-tabs v-if="!loading" :default-active-key="0">
                            <a-tab-pane
                                v-for="category, index in categories"
                                :key="index"
                                :tab="category.title"
                            >
                                <div class="grid grid-cols-3 gap-6 mb-3">
                                    <div v-for="product in products.filter((item) => item.category_id === category.id)" :key="product.id">
                                        <ProductCard :product="product" />
                                    </div>
                                </div>
                            </a-tab-pane>
                            <a-tab-pane key="combos" tab="Combo nóng hổi">
                                <div class="grid grid-cols-3 gap-6 mb-3">
                                    <div v-for="combo in combos" :key="combo.id">
                                        <ComboCard :combo="combo" />
                                    </div>
                                </div>
                            </a-tab-pane>
                        </a-tabs>
                        <div v-else class="w-full flex justify-center">
                            <a-spin size="large" class="spin_custom" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>

<script>
    import { mapState } from 'vuex';
    import ProductCard from '@/components/products/cards/Card.vue';
    import ComboCard from '@/components/products/cards/ComboCard.vue';

    export default {
        components: {
            ProductCard,
            ComboCard,
        },

        async fetch() {
            await this.fetchData();
        },

        data() {
            return {
                value: [],
                loading: false,
            };
        },

        computed: {
            ...mapState('products', ['products']),
            ...mapState('categories', ['categories']),
            ...mapState('combos', ['combos']),
        },

        methods: {
            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('products/fetchAll', this.$route.query);
                    await this.$store.dispatch('combos/fetchAll', this.$route.query);
                    await this.$store.dispatch('categories/fetchAll');
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
    .widget-title {
        &:before {
            @apply content-[''] absolute bottom-0 left-0 w-1.5 rounded-full h-1.5 bg-secondary-100
        }
        &:after {
            @apply content-[''] absolute bottom-0 left-3 w-12 rounded-sm h-1.5 bg-primary-100
        }
    }
</style>

<style lang="scss">
    .ant-checkbox-wrapper + .ant-checkbox-wrapper {
        @apply text-lg ml-0
    }
    .spin_custom {
        text-align: center;
    }
</style>
