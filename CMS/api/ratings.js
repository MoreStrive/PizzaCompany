export default (axios) => ({
    getAll: (id, params) => axios.get(`/cms/ratings/${id}`, { params }).then((_) => _.data),
    update: (id, payload) => axios.patch(`/cms/ratings/${id}`, payload).then((_) => _.data),
    delete: (id) => axios.delete(`/cms/ratings/${id}`).then((_) => _.data),
});
