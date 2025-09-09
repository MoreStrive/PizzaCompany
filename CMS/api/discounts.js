export default (axios) => ({
    getAll: (params) => axios.get('/cms/discounts', { params }).then((_) => _.data),
    create: (payload) => axios.post('/cms/discounts', payload).then((_) => _.data),
    update: (id, payload) => axios.patch(`/cms/discounts/${id}`, payload).then((_) => _.data),
    delete: (id) => axios.delete(`/cms/discounts/${id}`).then((_) => _.data),
});
