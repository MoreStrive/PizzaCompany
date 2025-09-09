export default (context, inject) => {
    // { ADMIN: 'ADMIN', MANAGE: 'MANAGE', STAFF: 'STAFF' };
    const Admin = () => context.$auth.user.role === 'ADMIN';
    const Manage = () => context.$auth.user.role === 'MANAGE';
    const Staff = () => context.$auth.user.role === 'STAFF';

    inject('permission', {
        Admin,
        Manage,
        Staff,
    });
};
