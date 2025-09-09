<template>
    <main>
        <section class="h-[400px] bg-[url('https://swigo.dexignzone.com/tailwind/xhtml/assets/images/background/pic1.png')] after:bg-[#222222e6] py-20 bg-cover bg-center bg-no-repeat bg-fixed relative z-[2] after:content-[''] after:absolute after:z-[-1] after:bg-black-blur after:opacity-100 after:w-full after:h-full after:top-0 after:left-0 after:backdrop-blur-[6px] flex flex-col justify-center">
            <div class="container">
                <div class="text-center">
                    <h2 class="text-7xl leading-[1.4] text-lobster text-white">
                        Sản phẩm của chúng tôi
                    </h2>
                </div>
            </div>
        </section>

        <section class="py-20">
            <div class="container">
                <div class="grid grid-cols-4 gap-8">
                    <div class="col-span-2">
                        <div class="h-[550px]">
                            <img :src="product && product?.thumbnail" class="w-full h-[550px] object-cover rounded-md" alt="">
                        </div>
                    </div>
                    <div class="col-span-2">
                        <div>
                            <h1 class="text-4xl font-semibold mb-0">
                                {{ product.product_name }}
                            </h1>
                            <p class="text-lg mt-2 mb-0">
                                {{ product.description }}
                            </p>
                            <p class="text-lg mt-2 mb-0" v-html="product.content" />

                            <div class="mt-4">
                                <div class="grid grid-cols-2 gap-4">
                                    <a-form-model-item v-if="product.sizes && product.sizes.length > 0" prop="" label="Chọn Size">
                                        <a-select
                                            v-model="size"
                                            placeholder="Size bánh"
                                            class="!w-full"
                                        >
                                            <a-select-option v-for="_size in product.sizes" :key="_size.size_value" :value="_size.size_value">
                                                {{ SIZE_LABEL[_size.size_value] }}
                                            </a-select-option>
                                        </a-select>
                                    </a-form-model-item>
                                    <a-form-model-item v-if="product.options && product.options.length > 0" prop="" label="Lựa chọn">
                                        <a-select
                                            v-model="option"
                                            placeholder="Lựa chọn"
                                            class="!w-full"
                                        >
                                            <a-select-option v-for="_option in product.options" :key="_option.option_value" :value="_option.option_value">
                                                {{ OPTION_LABEL[_option.option_value] }}
                                            </a-select-option>
                                        </a-select>
                                    </a-form-model-item>
                                </div>
                            </div>

                            <div v-if="product.toppings && product.toppings.length > 0" class="mt-4">
                                <h4 class="text-xl font-semibold">
                                    Thêm vào
                                </h4>

                                <div>
                                    <div class="grid grid-cols-2 gap-5">
                                        <div v-for="topping, index in product.toppings" :key="index" class="inline-flex p-[10px] w-full rounded-[10px] items-center border border-[#2222221a]">
                                            <div class="flex justify-between items-center w-full">
                                                <div>
                                                    <p class="font-medium mb-0 text-base">
                                                        {{ TOPPING_LABEL[topping.topping_value] }}
                                                    </p>
                                                    <p class="mb-0 text-base">
                                                        {{ topping.price | currencyFormat }}
                                                    </p>
                                                </div>
                                                <div>
                                                    <a-checkbox @change="(isCheck) => changetoppings(isCheck, topping.topping_value)" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="flex gap-10 mt-4">
                                <div>
                                    <h3 class="text-lg font-medium leading-[22px]">
                                        Giá tiền
                                    </h3>
                                    <h2 class="flex flex-col text-3xl mt-3">
                                        <span v-if="product.discount" class="line-through italic font-light">{{ calculatePriceProduct.total_price | currencyFormat }}</span>
                                        <span v-if="product.discount" class="italic font-light">Giảm giá ~ {{ product.discount }}%</span>
                                        <span class="font-semibold text-primary-100">{{ calculatePriceProduct.final_price | currencyFormat }}</span>
                                    </h2>
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
                                                    :disabled="countProduct <= 1"
                                                    @click="changeCount(-1)"
                                                >
                                                    <span class="text-3xl">-</span>
                                                </button>
                                                <span class="select-none block flex-1 text-center leading-none">{{ countProduct }}</span>
                                                <button
                                                    class="w-7 h-7 rounded-sm flex items-center justify-center border border-transparent bg-white focus:outline-none hover:border-neutral-700 disabled:hover:border-neutral-400 disabled:opacity-50 disabled:cursor-default"
                                                    type="button"
                                                    :disabled="countProduct >= 10"
                                                    @click="changeCount(1)"
                                                >
                                                    <span class="text-3xl">+</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <template v-if="product.status === 'active'">
                                <div class="flex items-center gap-5 mt-4">
                                    <span
                                        class="inline-block px-6 py-3 font-normal border-[1px] border-primary-100 border-solid text-white  rounded transition-all duration-300 bg-primary-100 hover:bg-transparent hover:text-primary-100 cursor-pointer"
                                        @click="addProductToCart"
                                    >
                                        Thêm vào giỏ hàng
                                    </span>

                                    <span class="inline-block px-6 py-3 font-normal border-[1px] border-secondary-100 border-solid text-white  rounded transition-all duration-300 bg-secondary-100 hover:bg-transparent hover:text-secondary-100 cursor-pointer" @click="buyNow">
                                        Mua ngay
                                    </span>
                                </div>
                            </template>
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
                        From Our Menu
                    </h2>
                </div>

                <div>
                    <MenuSlide :data="products" />
                </div>
            </div>
        </section>
        <RequestLoginDialog ref="RequestLoginDialog" />
    </main>
</template>

<script>
    import _cloneDeep from 'lodash/cloneDeep';
    import { mapState, mapGetters } from 'vuex';
    import ReviewProduct from '@/components/shared/ReviewProduct.vue';
    import MenuSlide from '@/components/products/MenuSlide.vue';
    import { mapDataFromOptions } from '@/utils/data';
    import { SIZE_OPTIONS } from '@/constants/products/size';
    import { TOPPINGS } from '@/constants/products/toppings';
    import { OPTIONS } from '@/constants/products/options';
    import RequestLoginDialog from '@/components/shared/RequestLoginDialog.vue';

    export default {
        components: {
            ReviewProduct,
            MenuSlide,
            RequestLoginDialog,
        },

        async fetch() {
            await this.fetchData();
        },

        data() {
            return {
                countProduct: 1,
                option: undefined,
                size: undefined,
                toppings: [],
            };
        },

        computed: {
            ...mapState('products', ['product', 'products']),
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

            isExsistProduct() {
                return this.useCart.cart.find((item) => this.product && item.value === this.product.id);
            },

            calculatePriceProduct() {
                if (this.product && this.product.id) {
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
                }
                return {
                    total_price: 0,
                    final_price: 0,
                };
            },
        },

        methods: {
            async fetchData() {
                try {
                    await this.$store.dispatch('products/fetchAll');
                    await this.$store.dispatch('products/fetchDetail', this.$route.params.id);
                    await this.$store.dispatch('products/comments/fetchAll', { id: this.$route.params.id, params: this.$route.query });

                    if (this.product) {
                        this.productVarible = _cloneDeep(this.product);
                        this.option = this.productVarible.options && this.productVarible.options.length > 0 ? this.productVarible.options[0]?.option_value : undefined;
                        this.size = this.productVarible.sizes && this.productVarible.sizes.length > 0 ? this.productVarible.sizes[0]?.size_value : undefined;
                        this.toppings = this.productVarible.toppings && this.productVarible.toppings.length > 0 ? [this.productVarible.toppings[0]?.topping_value] : [];
                        this.$forceUpdate();
                    }
                } catch (error) {
                    this.$handleError(error);
                }
            },

            changeCount(value) {
                this.countProduct += value;
            },

            changetoppings(isCheck, value) {
                if (isCheck.target.checked) {
                    this.toppings = [...this.toppings, value];
                } else {
                    this.toppings = this.toppings.filter((topping) => topping !== value);
                }
            },

            addProductToCart() {
                if (!this.size) this.$message.error('Kích cỡ bánh là lựa chọn bắt buộc');
                else {
                    this.$store.dispatch('products/addProductToCart', {
                        id: Date.now(),
                        product_id: this.product.id,
                        product: this.product,
                        type: 'PRODUCT',
                        size: this.size,
                        option: this.option,
                        toppings: this.toppings,
                        count: this.countProduct,
                        total_price: this.calculatePriceProduct.final_price,
                    });
                    this.$message.success('Thêm sản phẩm vào giỏ hàng thành công');
                }
            },

            buyNow() {
                if (this.$auth.user) {
                    if (!this.size) this.$message.error('Kích cỡ bánh là lựa chọn bắt buộc');
                    else {
                        this.$store.dispatch('products/addProductToCart', {
                            id: Date.now(),
                            product_id: this.product.id,
                            product: this.product,
                            type: 'PRODUCT',
                            size: this.size,
                            option: this.option,
                            toppings: this.toppings,
                            count: this.countProduct,
                            total_price: this.calculatePriceProduct.final_price,
                        });
                        this.$router.push('/thanh-toan');
                    }
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
