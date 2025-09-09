export default (axios) => ({
    getAll: (id, params) => axios.get(`/cms/materials-histories/${id}`, { params }).then((_) => _.data),
    create: (payload) => axios.post('/cms/materials-histories', payload).then((_) => _.data),
});
