export default (axios) => ({
    getAll: (params) => axios.get('/cms/orders', { params }).then((_) => _.data),
    getDetail: (id) => axios.get(`/cms/orders/${id}`).then((_) => _.data),
    create: (payload) => axios.post('/cms/orders', payload).then((_) => _.data),
    update: (id, payload) => axios.patch(`/cms/orders/${id}`, payload).then((_) => _.data),
    delete: (id) => axios.delete(`/cms/orders/export-email/${id}`).then((_) => _.data),
});
