export default (axios) => ({
    get: (params) => axios.get('/cms/settings', { params }).then((_) => _.data),
    update: (payload) => axios.patch('/cms/settings', payload).then((_) => _.data),
});
