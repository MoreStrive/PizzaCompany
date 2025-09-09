export default (axios) => ({
    getAll: (params) => axios.get('/client/categories', { params }).then((_) => _.data),
});
