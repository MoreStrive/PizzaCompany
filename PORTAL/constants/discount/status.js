export const STATUS = {
    INACTIVE: 'inactive',
    ACTIVE: 'active',
    OVER: 'over',
    EXPIRED: 'expired',
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
    label: 'Đã hết',
    color: 'blue',
    value: STATUS.OVER,
}, {
    label: 'Đã hết hạn',
    color: 'red',
    value: STATUS.EXPIRED,
}];
