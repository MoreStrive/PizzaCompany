import Auth from '@/api/auth';
import Combos from '@/api/combos';
import Contacts from '@/api/contacts';
import Discounts from '@/api/discounts';
import Manage from '@/api/manage';
import User from '@/api/users';
import Orders from '@/api/orders';
import Products from '@/api/products';
import Ratings from '@/api/ratings';
import Settings from '@/api/settings';
import Categories from '@/api/categories';
import Materials from '@/api/materials';
import MaterialHistories from '@/api/materialHistories';
import Dashboard from '@/api/dashboard';
import Uploaders from '@/api/uploaders';

export default (context, inject) => {
    // Initialize API factories
    const factories = {
        auth: Auth(context.$axios),
        combos: Combos(context.$axios),
        contacts: Contacts(context.$axios),
        discounts: Discounts(context.$axios),
        manage: Manage(context.$axios),
        orders: Orders(context.$axios),
        products: Products(context.$axios),
        ratings: Ratings(context.$axios),
        settings: Settings(context.$axios),
        uploaders: Uploaders(context.$axios),
        categories: Categories(context.$axios),
        materials: Materials(context.$axios),
        users: User(context.$axios),
        materialHistories: MaterialHistories(context.$axios),
        dashboard: Dashboard(context.$axios),
    };

    // Inject $api
    inject('api', factories);
};
