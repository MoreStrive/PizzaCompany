export const emptyState = () => ({
    comments: [],
    pagination: {},
    ratingAVG: 0,
});
export const state = emptyState;

export const mutations = {
    SET_STATE(state, { prop, data }) {
        state[prop] = data;
    },

};

export const actions = {
    async fetchAll({ commit }, { id, params }) {
        const { data: { ratings, ratingAVG, pagination } } = await this.$api.ratings.get(id, params);
        commit('SET_STATE', { prop: 'comments', data: ratings || [] });
        commit('SET_STATE', { prop: 'ratingAVG', data: ratingAVG || 0 });
        commit('SET_STATE', { prop: 'pagination', data: pagination || {} });
    },
};
