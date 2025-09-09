export default (axios) => ({
    login: (payload) => axios.post('/cms/sessions/login', payload).then((_) => _.data),
    getCurrentActor: () => axios.get('/cms/sessions/get-current-actor').then((_) => _.data),
    verifyEmail: (payload) => axios.post('/cms/sessions/verify-email', payload).then((_) => _.data),
    sendBackOtp: (payload) => axios.post('/cms/sessions/send-back-otp', payload).then((_) => _.data),
    update: (payload) => axios.patch('/cms/sessions', payload).then((_) => _.data),
    changePassword: (payload) => axios.patch('/cms/sessions/change-password', payload).then((_) => _.data),
    forgotPassword: (payload) => axios.post('/cms/sessions/forgot-password', payload).then((_) => _.data),
    verifyOtp: (payload) => axios.post('/cms/sessions/verify-otp', payload).then((_) => _.data),
    resetPassword: (id) => axios.post(`/cms/sessions/reset-password/${id}`).then((_) => _.data),
});
