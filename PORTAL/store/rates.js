export const state = () => ({
    ratings: [],
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
    async fetchAll({ commit }, payload) {
        const { data: { ratings, pagination } } = await this.$api.rates.getAll(payload.id, payload.params);
        commit('SET_STATE', { prop: 'ratings', data: ratings || [] });
        commit('SET_STATE', { prop: 'pagination', data: pagination });
    },
};
