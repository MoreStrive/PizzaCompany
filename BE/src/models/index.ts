import sequelize from '../database'; // Import kết nối database
import Category from './Category';
import Product from './Product';
import Cart from './Cart';
import CartItem from './CartItem';
import Combo from './Combo';
import ComboProduct from './ComboProduct';
import Contact from './Contact';
import Discount from './Discount';
import Material from './Material';
import MaterialHistory from './MaterialHistory';
import Order from './Order';
import OrderItem from './OrderItem';
import ProductOption from './ProductOption';
import ProductSize from './ProductSize';
import ProductTopping from './ProductTopping';
import Rating from './Rating';
import Setting from './Setting';
import StaffSystem from './StaffSystem';
import User from './User';

const defineAssociations = () => {
  Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
  Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

  Cart.hasMany(CartItem, { foreignKey: 'cart_id', as: 'cart_items' });
  CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });

  Product.hasMany(CartItem, { foreignKey: 'product_id', as: 'product_items' });
  CartItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

  Combo.hasMany(CartItem, { foreignKey: 'combo_id', as: 'combo_items' });
  CartItem.belongsTo(Combo, { foreignKey: 'combo_id', as: 'combo' });

  Combo.hasMany(ComboProduct, { foreignKey: 'combo_id', as: 'combo_products' });
  ComboProduct.belongsTo(Combo, { foreignKey: 'combo_id', as: 'combo' });

  ComboProduct.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
  Product.hasMany(ComboProduct, { foreignKey: 'product_id', as: 'product_combos' });

  MaterialHistory.belongsTo(StaffSystem, { foreignKey: 'staff_id', as: 'staff' });
  MaterialHistory.belongsTo(Material, { foreignKey: 'material_id', as: 'material' });

  StaffSystem.hasMany(MaterialHistory, { foreignKey: 'staff_id', as: 'material_histories' });
  Material.hasMany(MaterialHistory, { foreignKey: 'material_id', as: 'material_histories' });

  Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'order_items' });
  OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

  Order.belongsTo(Discount, {
    foreignKey: 'discount_id',
    as: 'discount',
  });

  Discount.hasMany(Order, {
    foreignKey: 'discount_id',
    as: 'orders',
  });

  Product.hasMany(OrderItem, { foreignKey: 'product_id', as: 'order_products' });
  OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

  Combo.hasMany(OrderItem, { foreignKey: 'combo_id', as: 'order_combos' });
  OrderItem.belongsTo(Combo, { foreignKey: 'combo_id', as: 'combo' });

  Product.hasMany(ProductOption, { foreignKey: 'product_id', as: 'options' });
  ProductOption.belongsTo(Product, { foreignKey: 'product_id' });

  Product.hasMany(ProductSize, { foreignKey: 'product_id', as: 'sizes' });
  ProductSize.belongsTo(Product, { foreignKey: 'product_id' });

  Product.hasMany(ProductTopping, { foreignKey: 'product_id', as: 'toppings' });
  ProductTopping.belongsTo(Product, { foreignKey: 'product_id' });

  Rating.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Rating.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
  Rating.belongsTo(Combo, { foreignKey: 'product_id', as: 'combo' });

  User.hasMany(Rating, { foreignKey: 'user_id', as: 'ratings' });
  Product.hasMany(Rating, { foreignKey: 'product_id', as: 'ratings' });
  Combo.hasMany(Rating, { foreignKey: 'product_id', as: 'ratings' });
};

defineAssociations();

export {
  sequelize,
  Category,
  Product,
  Cart,
  CartItem,
  Combo,
  ComboProduct,
  Contact,
  Discount,
  Material,
  MaterialHistory,
  Order,
  OrderItem,
  ProductOption,
  ProductSize,
  ProductTopping,
  Rating,
  Setting,
  StaffSystem,
  User,
};
