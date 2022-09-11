import { Component, OnInit } from '@angular/core';
import {Observable, switchMap} from "rxjs";
import {Order} from "../models/order";
import {AuthService} from "../auth.service";
import {OrderService} from "../order.service";

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {
  orders$: Observable<Order[]>;

  constructor(
    private authService: AuthService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.orders$ = this.authService.user$
      .pipe(
        switchMap((user) =>
          this.orderService.getOrdersByUser(user?.uid!)
        )
      )
  }

}
