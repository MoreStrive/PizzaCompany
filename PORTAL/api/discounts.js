export default (axios) => ({
    getByCode: (params) => axios.get('/client/discounts', { params }).then((_) => _.data),
});
