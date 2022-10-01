import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {Product} from "../models/product";
import {map, Observable, take} from "rxjs";
import {ShoppingCart} from "../models/shopping-cart";
import {ShoppingCartItem} from "../models/shopping-cart-item";

@Injectable()
export class ShoppingCartService {
  constructor(private db: AngularFireDatabase) { }

  async getCart(): Promise<Observable<ShoppingCart>> {
    let cartId = await this.getOrCreateCartId();
    return (this.db.object<ShoppingCart>('/shopping-carts/' + cartId))
      .valueChanges()
      .pipe(
        map(x =>
          new ShoppingCart(x!.items)
        )
      )
  }

  async clearCart() {
    let cartId = await this.getOrCreateCartId();
    this.db.object('/shopping-carts/' + cartId + '/items/').remove();
  }

  addToCart(product: Product) {
    this.updateProductItem(product, 1);
  }

  removeFromCart(product: Product) {
    this.updateProductItem(product, -1);
  }

  private create() {
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime()
    })
  }

  private getItem(cartId: string, productId: string) {
    return this.db.object<ShoppingCartItem>('/shopping-carts/' + cartId + '/items/' + productId);
  }

  private async getOrCreateCartId(): Promise<string> {
    let cartId = localStorage.getItem('cartId');
    if (cartId) return cartId;

    let result = await this.create();
    localStorage.setItem('cartId', result.key!);
    return result.key!;
  }

  private async updateProductItem(product: Product, changeNumber: number) {
    let cartId = await this.getOrCreateCartId();
    let prodItem = this.getItem(cartId, product.key);
    prodItem.snapshotChanges()
      .pipe(take(1))
      .subscribe( item => {
        if (changeNumber < 0 && (item.payload.toJSON() as ShoppingCartItem).quantity === 1) {
          prodItem.remove();
        } else {
          prodItem.update({
            title: product.title,
            images: product.images,
            price: product.price,
            mainImageUrl: product.images ? product.images[0].url : '',
            quantity: (item.payload.exists()
              ? (item.payload.toJSON() as ShoppingCartItem).quantity
              : 0) + changeNumber
          } as ShoppingCartItem )
        }
      })
  }

}
