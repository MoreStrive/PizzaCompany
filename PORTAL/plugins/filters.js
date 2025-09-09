import Vue from 'vue';
import dateFormat from '@/plugins/filters/dateFormat';

export default () => {
    Vue.filter('dateFormat', dateFormat);
    Vue.filter('currencyFormat', (number) => `${number ? parseInt(number, 10).toLocaleString('vi-VN') : '0'} VND`);
};
