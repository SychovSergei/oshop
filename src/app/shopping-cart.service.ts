import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireObject} from "@angular/fire/compat/database";
import {Product} from "./models/product";
import {map, Observable, take} from "rxjs";
import {ShoppingCart} from "./models/shopping-cart";
import {ShoppingCartItem} from "./models/shopping-cart-item";

@Injectable()
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  private create() {
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime()
    })
  }

  async getCart(): Promise<Observable<ShoppingCart>>
  {
    let cartId = await this.getOrCreateCartId();
    return (this.db.object<ShoppingCart>('/shopping-carts/' + cartId))
      .valueChanges()
      .pipe(
        map(x => new ShoppingCart(x!.items))
      )
  }

  private getItem(cartId: string, productId: string) {
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productId);
  }

  private async getOrCreateCartId(): Promise<string> {
    let cartId = localStorage.getItem('cartId');
    if (cartId) return cartId;

    let result = await this.create();
    localStorage.setItem('cartId', result.key!);
    return result.key!;
  }

  addToCart(product: Product) {
    this.updateProductCart(product, 1);
  }

  removeFromCart(product: Product) {
    this.updateProductCart(product, -1);
  }

  private async updateProductCart(product: Product, changeNumber: number) {
    let cartId = await this.getOrCreateCartId();
    let prodItem$ = this.getItem(cartId, product.key!);
    prodItem$.snapshotChanges()
      .pipe(take(1))
      .subscribe( item => {
        prodItem$.update(
          item.payload.exists()
            ? {product: product, quantity: (item.payload.toJSON() as ShoppingCartItem).quantity + changeNumber}
            : {product: product, quantity: 0}
          )}
      )
  }

}
