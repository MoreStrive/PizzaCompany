export const state = () => ({
    users: [],
    user: {},
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
        const { data: { users, pagination } } = await this.$api.users.getAll(params);
        commit('SET_STATE', { prop: 'users', data: users || [] });
        commit('SET_STATE', { prop: 'pagination', data: pagination });
    },

    async fetchDetail({ commit }, payload) {
        const { data: { user } } = await this.$api.users.getDetail(payload);
        commit('SET_STATE', { prop: 'user', data: user });
    },
};
