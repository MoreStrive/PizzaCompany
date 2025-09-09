import Auth from '@/api/auth';
import Orders from '@/api/orders';
import Uploaders from '@/api/uploaders';
import Carts from '@/api/carts';
import Products from '@/api/products';
import Discounts from '@/api/discounts';
import Categories from '@/api/categories';
import Settings from '@/api/settings';
import Ratings from '@/api/ratings';
import Combos from '@/api/combos';

export default (context, inject) => {
    // Initialize API factories
    const factories = {
        auth: Auth(context.$axios),
        combos: Combos(context.$axios),
        uploaders: Uploaders(context.$axios),
        orders: Orders(context.$axios),
        carts: Carts(context.$axios),
        products: Products(context.$axios),
        discounts: Discounts(context.$axios),
        categories: Categories(context.$axios),
        settings: Settings(context.$axios),
        ratings: Ratings(context.$axios),
    };

    inject('api', factories);
};
