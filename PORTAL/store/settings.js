export const state = () => ({
    setting: {},
});

export const getters = {
};

export const mutations = {
    SET_SETTING(state, payload) {
        state.setting = payload;
    },
};

export const actions = {
    async fetchAll({ commit }, query) {
        const { data: { setting } } = await this.$api.settings.getAll(query);
        commit('SET_SETTING', setting);
    },
};
