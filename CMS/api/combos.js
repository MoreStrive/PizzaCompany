export default (axios) => ({
    getAll: (params) => axios.get('/cms/combos', { params }).then((_) => _.data),
    getDetail: (id) => axios.get(`/cms/combos/${id}`).then((_) => _.data),
    create: (payload) => axios.post('/cms/combos', payload).then((_) => _.data),
    update: (id, payload) => axios.patch(`/cms/combos/${id}`, payload).then((_) => _.data),
    updateCount: (id, payload) => axios.patch(`/cms/combos/update-count/${id}`, payload).then((_) => _.data),
    changeStatus: (id, payload) => axios.patch(`/cms/combos/change-status/${id}`, payload).then((_) => _.data),
    delete: (id) => axios.delete(`/cms/combos/${id}`).then((_) => _.data),
});
