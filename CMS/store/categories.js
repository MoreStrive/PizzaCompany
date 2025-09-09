export const state = () => ({
    categories: [],
    category: {},
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
        const { data: { categories } } = await this.$api.categories.getAll(payload);
        console.log(categories);
        commit('SET_STATE', { prop: 'categories', data: categories });
    },

    async fetchDetail({ commit }, payload) {
        const { data: { category } } = await this.$api.categories.getDetail(payload);
        commit('SET_STATE', { prop: 'category', data: category });
    },
};
