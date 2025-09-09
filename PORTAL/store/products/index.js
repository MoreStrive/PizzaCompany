import _cloneDeep from 'lodash/cloneDeep';
import _isEqual from 'lodash/isEqual';

const initialLocalStorage = (key) => {
    const item = localStorage.getItem(key);
    return !item ? [] : JSON.parse(item);
};

export const emptyState = () => ({
    products: [],
    product: {},
    cart: initialLocalStorage('cart'),
});

export const state = emptyState;

export const getters = {
    useCart(state) {
        const calculatePrice = (_cartItem, _product) => {
            if (_cartItem && _product) {
                const priceOfOption = _product.options.find((_options) => _options.option_value === _cartItem.option)?.price || 0;
                const priceOfSize = _product.sizes.find((_size) => _size.size_value === _cartItem.size)?.price || 0;
                const discount = _product.discount;

                let toppingPrice = 0;
                const toppings = _cartItem.toppings || [];
                if (toppings && toppings.length > 0) {
                    toppings.map((topping) => {
                        const result = _product.toppings && _product.toppings.find((element) => element.topping_value === topping);
                        if (result) {
                            toppingPrice += result.price;
                        }
                        return topping;
                    });
                }
                const total_price = priceOfSize + priceOfOption + toppingPrice;
                return total_price - ((total_price / 100) * discount);
            }
            return 0;
        };
        const cart = state.cart && state.cart.map((item) => ({
            ...item,
            total_price: item.type === 'COMBO' ? item.total_price * item.count : calculatePrice(item, item.product) * item.count,
        }));
        const finalCartPrice = cart.reduce((accumulator, item) => accumulator + item.total_price, 0);
        const countCart = cart.reduce((accumulator, item) => accumulator + item.count, 0);

        return {
            cart,
            finalCartPrice,
            countCart,
        };
    },
};

export const mutations = {
    SET_STATE(state, { prop, data }) {
        state[prop] = data;
    },
    SET_PAGINATION(state, payload) {
        state.pagination = payload;
    },
    RESET_STATE(state) {
    // eslint-disable-next-line no-unused-vars
        state = emptyState;
    },
    SAVE_LOCAL(_, payload) {
        localStorage.setItem('cart', JSON.stringify(payload));
    },
    GET_LOCAL(state, payload) {
        state.cart = payload;
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { products } } = await this.$api.products.getAll({ ...params, limit: 1000 });
        commit('SET_STATE', { prop: 'products', data: products || [] });
    },

    async fetchFullRecord({ commit }, params) {
        const { data: { products } } = await this.$api.products.getFullRecord(params);
        commit('SET_STATE', { prop: 'products', data: products || [] });
    },

    async fetchDetail({ commit }, payload) {
        const { data: { product } } = await this.$api.products.getDetail(payload);
        commit('SET_STATE', { prop: 'product', data: product });
    },

    async fetchCart(context) {
        if (context.rootState.auth.loggedIn) {
            const { data: { cart } } = await this.$api.carts.get(context.rootState.auth.user.id);
            context.commit('SET_STATE', { prop: 'cart', data: cart });
        } else {
            context.commit('SET_STATE', { prop: 'cart', data: initialLocalStorage('cart') });
        }
    },

    async updateCart(context, payload) {
        if (context.rootState.auth.loggedIn) {
            await this.$api.carts.update(payload);
        }
    },

    async addProductToCart(context, payload) {
        const cacheCart = _cloneDeep(context.state.cart);
        const indexProductInCart = cacheCart.findIndex((item) => {
            if (payload.type === 'COMBO') return item.combo_id === payload.combo_id;
            if (payload.type === 'PRODUCT') return item.product_id === payload.product_id;
            return false;
        });

        const productInCart = cacheCart[indexProductInCart];

        if (indexProductInCart === -1 && !productInCart) cacheCart.unshift({ ...payload });
        else {
            const newProduct = payload;
            if (
                newProduct.size === productInCart.size
                    && (newProduct.option ?? null) === (productInCart.option ?? null)
                    && _isEqual(newProduct.toppings, productInCart.toppings)
            ) {
                cacheCart[indexProductInCart] = {
                    ...productInCart,
                    count: +productInCart.count + +payload.count,
                };
            } else cacheCart.unshift({ ...payload });
        }

        context.commit('SET_STATE', { prop: 'cart', data: cacheCart });
        context.commit('SAVE_LOCAL', cacheCart);
        await context.dispatch('updateCart', {
            cart_items: cacheCart,
        });
    },

    async removeProductToCart(context, payload) {
        const cacheCart = _cloneDeep(context.state.cart);
        const indexProductInCart = cacheCart.findIndex((item) => {
            if (payload.type === 'COMBO') return item.combo_id === payload.combo_id;
            if (payload.type === 'PRODUCT') return item.product_id === payload.product_id;
            return false;
        });
        cacheCart.splice(indexProductInCart, 1);
        context.commit('SET_STATE', { prop: 'cart', data: cacheCart });
        context.commit('SAVE_LOCAL', cacheCart);
        await context.dispatch('updateCart', {
            cart_items: cacheCart,
        });
    },

    async changeCountProduct(context, { value, count }) {
        const cacheCart = _cloneDeep(context.state.cart);
        const indexProductInCart = cacheCart.findIndex((item) => item.id === value);
        const productInCart = cacheCart[indexProductInCart];
        cacheCart[indexProductInCart] = {
            ...productInCart,
            count: cacheCart[indexProductInCart]?.count + count,
        };
        context.commit('SET_STATE', { prop: 'cart', data: cacheCart });
        context.commit('SAVE_LOCAL', cacheCart);
        await context.dispatch('updateCart', {
            cart_items: cacheCart,
        });
    },

    async changeOptionItemInCart(context, { value, type, newValue }) {
        const cacheCart = _cloneDeep(context.state.cart);
        const indexProductInCart = cacheCart.findIndex((item) => item.id === value);
        const productInCart = cacheCart[indexProductInCart];

        let newVal = null;
        if (type === 'option') {
            newVal = {
                ...productInCart,
                option: newValue,
            };
        } else if (type === 'size') {
            newVal = {
                ...productInCart,
                size: newValue,
            };
        } else if (type === 'toppings') {
            newVal = {
                ...productInCart,
                toppings: newValue,
            };
        }
        cacheCart[indexProductInCart] = {
            ...newVal,
        };
        context.commit('SET_STATE', { prop: 'cart', data: cacheCart });
        context.commit('SAVE_LOCAL', cacheCart);
        await context.dispatch('updateCart', {
            cart_items: cacheCart,
        });
    },

    async clearCart(context) {
        context.commit('SET_STATE', { prop: 'cart', data: [] });
        context.commit('SAVE_LOCAL', []);
        await context.dispatch('updateCart', {
            cart_items: [],
        });
    },

    resetState({ commit }) {
        commit('RESET_STATE');
    },
};
