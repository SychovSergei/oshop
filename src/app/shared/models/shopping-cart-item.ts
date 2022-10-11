import {ProductImage} from "./product";

export class ShoppingCartItem {
  key: string;
  title: string;
  price: number;
  mainImageUrl: string;
  quantity: number;
  dateCreated: number;
  description: string;
  discount: number;
  available: boolean;
  category: string;
  images: ProductImage[];

  constructor(init?: Partial<ShoppingCartItem>) {
    Object.assign(this, init);
  }

  get totalPrice() {
    return this.price * this.quantity;
  }
}
