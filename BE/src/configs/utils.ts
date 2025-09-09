
import cloneDeep from 'lodash/cloneDeep';

function getProductPrice (product: any, item: any): number {
  // Lấy giá của size và option
  const priceOfSize = product.sizes?.find((_size: any) => _size.size_value === item.size)?.price || 0;
  const priceOfOption = product.options?.find((_option: any) => _option.option_value === item.option)?.price || 0;

  // Xử lý toppings ngắn gọn
  const toppings: string[] = (() => {
    if (!item?.toppings) return [];
    if (Array.isArray(item.toppings)) return item.toppings;
    try {
      const parsed = JSON.parse(item.toppings);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      console.warn('Invalid toppings format:', item.toppings);
      return [];
    }
  })();

  // Tính giá toppings
  const toppingPrice = toppings.reduce((total: number, topping: string) => {
    const result = product.toppings?.find((element: any) => element.topping_value === topping);
    return total + (result?.price || 0);
  }, 0);

  // Tính tổng giá
  const totalPrice = priceOfSize + priceOfOption + toppingPrice;

  // Áp dụng giảm giá (discount)
  const discount = product.discount || 0;
  const finalPrice = discount ? totalPrice - (totalPrice * discount / 100) : totalPrice;

  return finalPrice;
}

function getComboPrice (combo: any): number {
  const totalPrice = combo.total_price || 0; // Tổng giá trước giảm giá
  const discount = combo.discount || 0; // Phần trăm giảm giá

  const finalPrice = discount ? totalPrice - (totalPrice * discount / 100) : totalPrice;
  return finalPrice;
}

function permit (obj: any, filters: string[]): any {
  const clonedObj = cloneDeep(obj); // Tạo bản sao của object
  clonedObj._filters = filters || []; // Lưu bộ lọc

  return {
    value: () => {
      const permittedParams: any = {};
      clonedObj._filters.forEach((key: string) => {
        if (Object.prototype.hasOwnProperty.call(clonedObj, key)) {
          permittedParams[key] = clonedObj[key];
        }
      });
      return permittedParams;
    },
  };
}

export {
  getProductPrice,
  getComboPrice,
  permit,
};
