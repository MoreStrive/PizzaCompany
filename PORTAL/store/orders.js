export const state = () => ({
    orders: [],
    order: {},
    pagination: {},
});

export const getters = {
};

export const mutations = {
    SET_STATE(state, { prop, data }) {
        state[prop] = data;
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { orders, pagination } } = await this.$api.orders.getAll(params);
        commit('SET_STATE', { prop: 'orders', data: orders || [] });
        commit('SET_STATE', { prop: 'pagination', data: pagination || {} });
    },

    async fetchDetail({ commit }, payload) {
        const { data: { order } } = await this.$api.orders.getDetail(payload);
        commit('SET_STATE', { prop: 'order', data: order });
    },
};
