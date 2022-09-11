import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {Observable} from "rxjs";
import {ShoppingCartService} from "./shopping-cart.service";
import {Order} from "./models/order";

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

  getOrders(): Observable<Order[]> {
    return this.db.list<Order>('/orders').valueChanges();
  }

  getOrdersByUser(userId: string): Observable<Order[]> {
    return this.db.list<Order>('/orders',
        ref => ref.orderByChild('userId').equalTo(userId)
    ).valueChanges();
  }
}
