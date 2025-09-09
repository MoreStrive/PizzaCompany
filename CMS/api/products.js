export default (axios) => ({
    getAll: (params) => axios.get('/cms/products', { params }).then((_) => _.data),
    getFullRecord: (params) => axios.get('/cms/products/get-all', { params }).then((_) => _.data),
    getDetail: (id) => axios.get(`/cms/products/${id}`).then((_) => _.data),
    updateCount: (id, payload) => axios.patch(`/cms/products/update-count/${id}`, payload).then((_) => _.data),
    changeStatus: (id, payload) => axios.patch(`/cms/products/change-status/${id}`, payload).then((_) => _.data),
    create: (payload) => axios.post('/cms/products', payload).then((_) => _.data),
    update: (id, payload) => axios.patch(`/cms/products/${id}`, payload).then((_) => _.data),
    delete: (id) => axios.delete(`/cms/products/${id}`).then((_) => _.data),
});
