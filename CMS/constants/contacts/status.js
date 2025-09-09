export const STATUS = {
    PROCESSED: 'processed',
    UN_PROCESSED: 'unProcessed',
};

export const STATUS_OPTIONS = [{
    label: 'Read',
    value: STATUS.PROCESSED,
    color: 'green',
}, {
    label: 'Unread',
    value: STATUS.UN_PROCESSED,
    color: 'blue',
}];
