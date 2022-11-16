import {ShoppingCartItem} from "./shopping-cart-item";
import {ProductTypeUnion} from "./product";

export class ShoppingCart {
  public productCartList: ShoppingCartItem<any>[] = [];

  constructor(public items: {[prodId: string]: ShoppingCartItem<any>}) {
    this.items = items || {};

    for (let prodId in items) {
      let item = items[prodId];
      this.productCartList
        .push(new ShoppingCartItem({ ...item, key: prodId }));
    }
  }

  getQuantity(product: ProductTypeUnion): number {
    let item = this.items[product.key!];
    return item ? item.quantity : 0;
  }

  get totalPrice() {
    return this.productCartList.reduce((acc, product) => {
      return acc + product.totalPrice
    }, 0)
  }

  get totalItemsCount() {
    let count = 0;
    for (let productId in this.items) {
      count += this.items[productId].quantity;
    }
    return count;
  }
}
