import {Product} from "./product";

export class WishList {
  public wishList: Product[] = [];

  constructor(public items: { [prodId: string]: Product }) {
    this.items = items || {};

    for (let prodId in items) {
      let item = items[prodId];
      this.wishList.push({ key: prodId, ...item });
    }
  }

  isOnList(product: Product): boolean {
    return this.wishList
      ? this.wishList.findIndex((item) => { return item.key === product.key }) >= 0
      : false;
  }

  get totalItemsCount(): number {
    return this.wishList ? this.wishList.length : 0;
  }
}
