export default (axios) => ({
    getAll: (params) => axios.get('/cms/materials', { params }).then((_) => _.data),
    create: (payload) => axios.post('/cms/materials', payload).then((_) => _.data),
    getDetail: (id) => axios.get(`/cms/materials/${id}`).then((_) => _.data),
    update: (id, payload) => axios.patch(`/cms/materials/${id}`, payload).then((_) => _.data),
    delete: (id) => axios.delete(`/cms/materials/${id}`).then((_) => _.data),
});
