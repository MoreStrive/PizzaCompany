export default (axios) => ({
    getAll: (params) => axios.get('/client/orders', { params }).then((_) => _.data),
    create: (payload) => axios.post('/client/orders', payload).then((_) => _.data),
    getDetail: (id) => axios.get(`/client/orders/${id}`).then((_) => _.data),
    changeStatus: (id) => axios.patch(`/client/orders/change-status/${id}`).then((_) => _.data),
});
