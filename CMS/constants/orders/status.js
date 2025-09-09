export const STATUS = {
    DRAFT: 'draft',
    PENDING: 'pending',
    REJECT: 'reject',
    SUCCESS: 'success',
    ACCEPT: 'accept',
    DELIVERING: 'delivering',
    COOKING: 'cooking',
    DENIED: 'denied',
};

export const STATUS_OPTIONS = [{
    label: 'Bản nháp',
    value: STATUS.DRAFT,
    color: 'purple',
}, {
    label: 'Đang chờ',
    value: STATUS.PENDING,
    color: 'blue',
}, {
    label: 'Từ chối',
    value: STATUS.REJECT,
    color: 'red',
}, {
    label: 'Thành công',
    value: STATUS.SUCCESS,
    color: 'green',
}, {
    label: 'Chấp nhận',
    value: STATUS.ACCEPT,
    color: 'green',
}, {
    label: 'Đang giao',
    value: STATUS.DELIVERING,
    color: 'cyan',
}, {
    label: 'Đang chuẩn bị',
    value: STATUS.COOKING,
    color: 'orange',
}, {
    label: 'Đã hủy',
    value: STATUS.DENIED,
    color: 'red',
}];
