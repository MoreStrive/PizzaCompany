export default (axios) => ({
    getAll: (params) => axios.get('/client/settings', { params }).then((_) => _.data),
    createContact: (data) => axios.post('/client/contacts', data).then((_) => _.data),
});
