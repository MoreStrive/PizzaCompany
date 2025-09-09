export const state = () => ({
    discounts: [],
    discount: {},
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
    async fetchAll({ commit }) {
        const { data: { discounts, pagination } } = await this.$api.discounts.getAll();
        commit('SET_STATE', { prop: 'discounts', data: discounts || [] });
        commit('SET_STATE', { prop: 'pagination', data: pagination });
    },

    async fetchDetail({ commit }, payload) {
        const { data: { discount } } = await this.$api.discounts.getDetail(payload);
        commit('SET_STATE', { prop: 'discount', data: discount });
    },
};
