// import _uniqBy from 'lodash/uniqBy';

export const state = () => ({
    combos: [],
    combo: {},
    pagination: {},
});

export const getters = {};

export const mutations = {
    SET_STATE(state, { prop, data }) {
        state[prop] = data;
    },
};

export const actions = {
    async fetchAll({ commit }) {
        const { data: { combos, pagination } } = await this.$api.combos.getAll();
        commit('SET_STATE', { prop: 'combos', data: combos || [] });
        commit('SET_STATE', { prop: 'pagination', data: pagination });
    },

    async fetchDetail({ commit }, payload) {
        const { data: { combo } } = await this.$api.combos.getDetail(payload);
        commit('SET_STATE', { prop: 'combo', data: combo });
    },
};
