export default (axios) => ({
    getAll: (params) => axios.get('/cms/contacts', { params }).then((_) => _.data),
    update: (id, payload) => axios.patch(`/cms/contacts/${id}`, payload).then((_) => _.data),
});
