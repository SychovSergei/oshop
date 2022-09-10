import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {Observable} from "rxjs";
import {ShoppingCartService} from "./shopping-cart.service";

@Injectable()
export class OrderService {
  constructor(
    private shoppingCartService: ShoppingCartService,
    private db: AngularFireDatabase
  ) { }

  async placeOrder(order: any) {
    let resultOrderId = await this.db.list('/orders').push(order);
    this.shoppingCartService.clearCart();
    return resultOrderId;
  }

  getOrders(): Observable<any> {
    return this.db.list('orders').valueChanges();
  }
}
