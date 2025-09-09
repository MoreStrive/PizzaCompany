export default (axios) => ({
    uploadFiles: (paylaod) => axios.post('/uploads', paylaod).then((_) => _.data),
});
