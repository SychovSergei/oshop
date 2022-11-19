import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Order} from "../../../shared/models/order";
import {ShoppingCart} from "../../../shared/models/shopping-cart";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {AuthService} from "../../../shared/services/auth.service";
import {OrderService} from "../../../shared/services/order.service";

@Component({
  selector: 'shipping-form',
  templateUrl: './shipping-form.component.html',
  styleUrls: ['./shipping-form.component.scss']
})
export class ShippingFormComponent implements OnInit {
  @Input('cart') cart: ShoppingCart;
  form: FormGroup;
  userId: string;
  subUser: Subscription;

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subUser = this.authService.user$.subscribe(user => this.userId = user?.uid!)
    this.form = new FormGroup({
      name: new FormControl('Serg', [
        Validators.required,
        Validators.minLength(2)
      ]),
      addressLine1: new FormControl('Dushkina', [
        Validators.required,
        Validators.minLength(2)
      ]),
      addressLine2: new FormControl('', []),
      city: new FormControl('Kharkiv', [
        Validators.required
      ])
    });
  }

  async placeOrder() {
    let order = new Order(this.userId, this.form.value, this.cart);
    let res = await this.orderService.placeOrder(order);
    this.router.navigate(['/order-success', res.key]);
  }

  ngOnDestroy() {
    this.subUser.unsubscribe();
  }

}
