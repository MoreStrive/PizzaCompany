export const STAFF_STATUS = {
    INACTIVE: 'inactive',
    ACTIVE: 'active',
    PENDING: 'pending',
    LAYOFF: 'layoff',
};

export const STAFF_STATUS_OPTIONS = [{
    label: 'Hoạt động',
    color: 'green',
    value: STAFF_STATUS.ACTIVE,
}, {
    label: 'Không hoạt động',
    color: 'red',
    value: STAFF_STATUS.INACTIVE,
}, {
    label: 'Đang chờ',
    color: 'blue',
    value: STAFF_STATUS.PENDING,
}, {
    label: 'Đã nghỉ',
    color: 'yellow',
    value: STAFF_STATUS.LAYOFF,
}];
