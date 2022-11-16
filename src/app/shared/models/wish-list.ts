import {Product, ProductTypeUnion} from "./product";

export class WishList {
  public wishList: ProductTypeUnion[] = [];

  constructor(public items: { [prodId: string]: ProductTypeUnion }) {
    this.items = items || {};

    for (let prodId in items) {
      let item = items[prodId];
      this.wishList.push({ key: prodId, ...item });
    }
  }

  isOnList(product: Product<any>): boolean {
    return this.wishList
      ? this.wishList.findIndex((item) => { return item.key === product.key }) >= 0
      : false;
  }

  get totalItemsCount(): number {
    return this.wishList ? this.wishList.length : 0;
  }
}
