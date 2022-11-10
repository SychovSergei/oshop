import { Component, OnInit } from '@angular/core';
import {Observable, switchMap} from "rxjs";
import {Order} from "../../../shared/models/order";
import {AuthService} from "../../../shared/services/auth.service";
import {OrderService} from "../../../shared/services/order.service";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
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
