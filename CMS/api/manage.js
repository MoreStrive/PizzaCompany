export default (axios) => ({
    getAll: (params) => axios.get('/cms/manage', { params }).then((_) => _.data),
    getDetail: (id, payload) => axios.get(`/cms/manage/${id}`, payload).then((_) => _.data),
    create: (payload) => axios.post('/cms/manage', payload).then((_) => _.data),
    update: (id, payload) => axios.patch(`/cms/manage/${id}`, payload).then((_) => _.data),
    updateRole: (id, payload) => axios.patch(`/cms/update-role/manage/${id}`, payload).then((_) => _.data),
    delete: (id) => axios.delete(`/cms/manage/${id}`).then((_) => _.data),
});
