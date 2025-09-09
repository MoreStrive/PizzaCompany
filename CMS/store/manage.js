export const state = () => ({
    staffs: [],
    staff: {},
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
        const { data: { staffs, pagination } } = await this.$api.manage.getAll(params);
        commit('SET_STATE', { prop: 'staffs', data: staffs || [] });
        commit('SET_STATE', { prop: 'pagination', data: pagination });
    },

    async fetchDetail({ commit }, payload) {
        const { data: { staff } } = await this.$api.manage.getDetail(payload);
        commit('SET_STATE', { prop: 'staff', data: staff });
    },
};
