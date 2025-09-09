export const STATUS = {
    INACTIVE: 'inactive',
    ACTIVE: 'active',
    PENDING: 'pending',
};

export const STATUS_OPTIONS = [{
    label: 'Hoạt động',
    color: 'green',
    value: STATUS.ACTIVE,
}, {
    label: 'Không hoạt động',
    color: 'red',
    value: STATUS.INACTIVE,
}, {
    label: 'Đang chờ',
    color: 'blue',
    value: STATUS.PENDING,
}];
