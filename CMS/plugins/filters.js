import Vue from 'vue';
import dateFormat from '@/plugins/filters/dateFormat';

export default () => {
    Vue.filter('dateFormat', dateFormat);
    Vue.filter('currencyFormat', (number) => `${number ? number.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : '0 VND'}`);
};
