export const CLASS = {
    BRONZE: 'Bronze', SILVER: 'Silver', GOLD: 'Gold', DIAMOND: 'Diamond',
};

export const CLASS_OPTIONS = [{
    label: 'Hạng thành viên',
    value: CLASS.BRONZE,
    condition: 0,
}, {
    label: 'Hạng bạc',
    value: CLASS.SILVER,
    condition: 2000000,
}, {
    label: 'Hạng vàng',
    value: CLASS.GOLD,
    condition: 5000000,
}, {
    label: 'Hạng kim cương',
    value: CLASS.DIAMOND,
    condition: 10000000,
}];
