export const USER_STATUS = {
    INACTIVE: 'inactive',
    ACTIVE: 'active',
    PENDING: 'pending',
};

export const USER_STATUS_OPTIONS = [{
    label: 'Hoạt động',
    color: 'green',
    value: USER_STATUS.ACTIVE,
}, {
    label: 'Không hoạt động',
    color: 'red',
    value: USER_STATUS.INACTIVE,
}, {
    label: 'Đang chờ',
    color: 'blue',
    value: USER_STATUS.PENDING,
}];
