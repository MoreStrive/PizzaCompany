export default (axios) => ({
    getAll: (params) => axios.get('/cms/categories', { params }).then((_) => _.data),
    create: (payload) => axios.post('/cms/categories', payload).then((_) => _.data),
    getDetail: (id) => axios.get(`/cms/categories/${id}`).then((_) => _.data),
    update: (id, payload) => axios.patch(`/cms/categories/${id}`, payload).then((_) => _.data),
    delete: (id) => axios.delete(`/cms/categories/${id}`).then((_) => _.data),
});
