export const state = () => ({
    setting: {},
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
        const { data: { setting } } = await this.$api.settings.get();
        commit('SET_STATE', { prop: 'setting', data: setting || {} });
    },

    async update(context, payload) {
        await this.$api.settings.update(payload);
    },
};
