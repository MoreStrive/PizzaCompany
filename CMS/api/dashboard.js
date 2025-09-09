export default (axios) => ({
    get: (params) => axios.get('/cms/dashboard', { params }).then((_) => _.data),
});
