export const PAYMENT_METHODS = {
    CASH: 'cash',
    PAYMENT: 'payment',
};

export const PAYMENT_METHODS_OPTIONS = [{
    label: 'Thanh toán tiền mặt',
    value: PAYMENT_METHODS.CASH,
}, {
    label: 'Thanh toán Online ( QR code )',
    value: PAYMENT_METHODS.PAYMENT,
}];
