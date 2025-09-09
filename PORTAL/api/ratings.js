export default (axios) => ({
    get: (id, params) => axios.get(`/client/ratings/${id}`, { params }).then((_) => _.data),
    create: (id, payload) => axios.post(`/client/ratings/${id}`, payload).then((_) => _.data),
});
