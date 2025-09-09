// import _uniqBy from 'lodash/uniqBy';

export const state = () => ({
    products: [],
    product: {},
    pagination: {},
});

export const getters = {};

export const mutations = {
    SET_STATE(state, { prop, data }) {
        state[prop] = data;
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { products, pagination } } = await this.$api.products.getAll(params);
        commit('SET_STATE', { prop: 'products', data: products || [] });
        commit('SET_STATE', { prop: 'pagination', data: pagination });
    },

    async fetchFullRecord({ commit }, params) {
        const { data: { products } } = await this.$api.products.getFullRecord(params);
        commit('SET_STATE', { prop: 'products', data: products || [] });
    },

    async fetchDetail({ commit }, payload) {
        const { data: { product } } = await this.$api.products.getDetail(payload);
        commit('SET_STATE', { prop: 'product', data: product });
    },
};
