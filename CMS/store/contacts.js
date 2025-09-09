export const state = () => ({
    contacts: [],
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
        const { data: { contacts, pagination } } = await this.$api.contacts.getAll(params);
        commit('SET_STATE', { prop: 'contacts', data: contacts || [] });
        commit('SET_STATE', { prop: 'pagination', data: pagination || {} });
    },
};
