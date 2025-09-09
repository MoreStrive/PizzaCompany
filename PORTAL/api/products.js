export default (axios) => ({
    getAll: (params) => axios.get('/client/products', { params }).then((_) => _.data),
    getFullRecord: (params) => axios.get('/client/products/get-all', { params }).then((_) => _.data),
    getDetail: (id) => axios.get(`/client/products/${id}`).then((_) => _.data),
});
