export default (axios) => ({
    get: (id) => axios.get(`/client/carts/${id}`).then((_) => _.data),
    update: (data) => axios.patch('/client/carts', data).then((_) => _.data),
});
