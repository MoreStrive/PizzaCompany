export default (axios) => ({
    register: (payload) => axios.post('/client/sessions/register', payload).then((_) => _.data),
    verifyEmail: (payload) => axios.post('/client/sessions/verify-email', payload).then((_) => _.data),
    sendBackOtp: (payload) => axios.post('/client/sessions/send-back-otp', payload).then((_) => _.data),
    update: (payload) => axios.patch('/client/sessions', payload).then((_) => _.data),
    changePassword: (payload) => axios.patch('/client/sessions/change-password', payload).then((_) => _.data),
    forgotPassword: (payload) => axios.post('/client/sessions/forgot-password', payload).then((_) => _.data),
    verifyOtp: (payload) => axios.post('/client/sessions/verify-otp', payload).then((_) => _.data),
    resetPassword: (payload) => axios.post('/client/sessions/reset-password', payload).then((_) => _.data),
    newPassword: (payload) => axios.post('/client/sessions/reset-password', payload).then((_) => _.data),
});
