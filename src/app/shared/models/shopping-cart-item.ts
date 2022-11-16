import {ProductImage} from "./product";

export class ShoppingCartItem<T> {
  key: string;
  creatorId: string;
  dateCreated: number;
  dateModify: number;
  title: string;
  price: number;
  mainImageUrl: string;
  quantity: number;
  description: string;
  discount: number;
  available: boolean;
  category: string;
  images: ProductImage[];
  details: T;

  constructor(init?: Partial<ShoppingCartItem<T>>) {
    Object.assign(this, init);
  }

  get totalPrice() {
    return this.price * this.quantity;
  }
}
