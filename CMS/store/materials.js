export const state = () => ({
    materials: [],
    histories: [],
    material: {},
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
        const { data: { materials } } = await this.$api.materials.getAll(params);
        commit('SET_STATE', { prop: 'materials', data: materials });
    },

    async fetchDetail({ commit }, payload) {
        const { data: { material } } = await this.$api.materials.getDetail(payload);
        commit('SET_STATE', { prop: 'material', data: material });
    },

    async fetchHistories({ commit }, { id, params }) {
        const { data: { materialHistories } } = await this.$api.materialHistories.getAll(id, params);
        commit('SET_STATE', { prop: 'histories', data: materialHistories });
    },
};
