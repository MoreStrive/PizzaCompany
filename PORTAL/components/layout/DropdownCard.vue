<template>
    <div class="duration-300 origin-top-right block z-10 w-screen max-w-lg px-4 mt-3.5 -right-12 sm:-right-0 sm:px-0 opacity-100 translate-y-0">
        <div class="overflow-hidden bg-white">
            <div v-if="cart && cart.length" class="relative bg-white">
                <div class="max-h-[60vh] px-5 overflow-y-auto hiddenScrollbar">
                    <h3 class="text-xl font-semibold">
                        Giỏ hàng <span class="text-primary-100">{{ useCart.countCart || 0 }}</span> sản phẩm
                    </h3>
                    <div>
                        <div v-for="cartItem in cart" :key="cartItem.id" class="flex py-5 last:pb-0">
                            <template v-if="cartItem.type === 'PRODUCT'">
                                <div class="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                                    <img
                                        :src="_get(cartItem, 'product.thumbnail', '/images/card/card-special-1.png')"
                                        :alt="_get(cartItem, 'product.product_name', '')"
                                        class="h-full w-full object-cover object-center"
                                    >
                                    <nuxt-link class="absolute inset-0" :to="`/san-pham/${cartItem.value}`" />
                                </div>
                                <div class="ml-4 flex flex-1 flex-col">
                                    <div>
                                        <div class="flex justify-between">
                                            <h3 class="text-base font-medium ">
                                                <nuxt-link :to="`/san-pham/${cartItem.value}`">
                                                    {{ _get(cartItem, 'product.product_name', '') }}
                                                </nuxt-link>
                                            </h3>
                                            <div>
                                                {{ cartItem.total_price | currencyFormat }}
                                            </div>
                                        </div>

                                        <div>
                                            <div class="flex flex-col">
                                                <span v-if="cartItem.size">Size: {{ SIZE_LABEL[cartItem.size] }}</span>
                                                <span v-if="cartItem.option">Lựa chọn: {{ OPTION_LABEL[cartItem.option] }}</span>
                                                <span v-if="cartItem.toppings && cartItem.toppings.length > 0" class="mb-0">
                                                    toppings:
                                                    <span v-for="topping, index in cartItem.toppings" :key="index">{{ TOPPING_LABEL[topping] + ', ' }}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex flex-1 items-end justify-between text-sm mt-2">
                                        <p class="text-gray-500 mb-0">
                                            <span class="font-semibold">Số lượng</span>: {{ _get(cartItem, 'count', '') }}
                                        </p>
                                        <div class="flex">
                                            <button type="button" class="font-medium text-danger-100" @click="() => { $refs.ConfirmDialog.open(), productSelected = cartItem}">
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <template v-if="cartItem.type === 'COMBO'">
                                <div class="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                                    <img
                                        :src="_get(cartItem, 'combo.thumbnail', '/images/card/card-special-1.png')"
                                        :alt="_get(cartItem, 'combo.title', '')"
                                        class="h-full w-full object-cover object-center"
                                    >
                                    <nuxt-link class="absolute inset-0" :to="`/combo/${_get(cartItem, 'combo.id', '')}`" />
                                </div>
                                <div class="ml-4 flex flex-1 flex-col">
                                    <div>
                                        <div class="flex justify-between">
                                            <h3 class="text-base font-medium ">
                                                <nuxt-link :to="`/combo/${_get(cartItem, 'combo.id', '')}`">
                                                    {{ _get(cartItem, 'combo.title', '') }}
                                                </nuxt-link>
                                            </h3>
                                            <div>
                                                {{ cartItem.total_price | currencyFormat }}
                                            </div>
                                        </div>

                                        <div class="grid grid-cols-1 gap-2">
                                            <div v-for="product in cartItem.combo && cartItem.combo?.combo_products ? cartItem.combo?.combo_products : []" :key="product.id">
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
                                                    <span v-for="topping, index in product.toppings" :key="index">{{ TOPPING_LABEL[topping] + ', ' }}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex flex-1 items-end justify-between text-sm mt-2">
                                        <p class="text-gray-500 mb-0">
                                            <span class="font-semibold">Số lượng</span>: {{ _get(cartItem, 'count', '') }}
                                        </p>
                                        <div class="flex">
                                            <button type="button" class="font-medium text-danger-100" @click="() => { $refs.ConfirmDialog.open(), productSelected = cartItem}">
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="pt-5">
                    <div class="flex space-x-2 mt-5">
                        <nuxt-link
                            class="relative h-auto items-center text-center rounded-full transition-all duration-300 text-base py-3 px-6 hover:!text-white hover:bg-primary-100 bg-transparent flex-1 border border-primary-100 !text-primary-100"
                            to="/gio-hang"
                        >
                            Xem chi tiết
                        </nuxt-link>
                        <nuxt-link
                            class="relative h-auto items-center text-center rounded-full transition-all duration-300 text-base py-3 px-6 !text-white bg-primary-100 hover:bg-transparent flex-1 border border-primary-100 hover:!text-primary-100"
                            to="/thanh-toan"
                        >
                            Thanh toán
                        </nuxt-link>
                    </div>
                </div>
            </div>
            <div v-else class="py-10">
                <a-empty description="Chưa có sản phẩm trong giỏ hàng" />
            </div>
        </div>

        <ConfirmDialog
            ref="ConfirmDialog"
            title="Xác nhận"
            content="Bạn chắc chắn xóa sản phẩm này chứ"
            @confirm="removeProduct"
        />
    </div>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';
    import _get from 'lodash/get';
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
    import { mapDataFromOptions } from '@/utils/data';
    import { SIZE_OPTIONS } from '@/constants/products/size';
    import { TOPPINGS } from '@/constants/products/toppings';
    import { OPTIONS } from '@/constants/products/options';

    export default {
        components: {
            ConfirmDialog,
        },

        props: {
            cart: {
                type: Array,
                default: () => [],
            },
        },

        data() {
            return {
                productSelected: null,
            };
        },

        computed: {
            ...mapGetters('products', ['useCart']),
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
            async removeProduct() {
                try {
                    await this.$store.dispatch('products/removeProductToCart', this.productSelected);
                    this.$emit('updateCart');
                    this.$nuxt.refresh();
                    this.$message.success('Xóa sản phẩm thành công.');
                } catch (error) {
                    this.$handleError(error);
                }
            },

            hiddenCart() {
                this.$emit('hidden');
            },
        },
    };
</script>
