export default (axios) => ({
    getAll: (params) => axios.get('/cms/users', { params }).then((_) => _.data),
    getDetail: (id) => axios.get(`/cms/users/${id}`).then((_) => _.data),
    create: (payload) => axios.post('/cms/users/', payload).then((_) => _.data),
    update: (id, payload) => axios.patch(`/cms/users/${id}`, payload).then((_) => _.data),
    delete: (id) => axios.delete(`/cms/users/${id}`).then((_) => _.data),
});
