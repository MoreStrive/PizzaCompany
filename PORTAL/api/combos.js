export default (axios) => ({
    getAll: (params) => axios.get('/client/combos', params).then((_) => _.data),
    getDetail: (id) => axios.get(`/client/combos/${id}`).then((_) => _.data),
});
