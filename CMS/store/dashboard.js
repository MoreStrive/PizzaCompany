export const state = () => ({
    dashboard: {},
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
        const { data: { dashboard } } = await this.$api.dashboard.get(payload);
        commit('SET_STATE', { prop: 'dashboard', data: dashboard || {} });
    },
};
