import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ShoppingCartService} from "../shopping-cart.service";
import {ShoppingCart} from "../models/shopping-cart";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit, OnDestroy {
  form: FormGroup;
  cart: ShoppingCart;
  subCart: Subscription;

  constructor(private shoppingCartService: ShoppingCartService) { }

  async ngOnInit() {
    let cart$ = (await this.shoppingCartService.getCart());
    this.subCart = cart$.subscribe(cart => this.cart = cart);
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

  ngOnDestroy() {
    this.subCart.unsubscribe();
  }

  // placeOrder(value: ɵTypedOrUntyped<any, ɵFormGroupValue<any>, any>) {
  placeOrder(value: any) {
    let order = {
      datePlaced: new Date().getTime(),
      shipping: this.form.value,
      items: this.cart.productCartList.map(i => {
        return {
          product: {
            title: i.title,
            imageUrl: i.imageUrl,
            price: i.price
          },
          quantity: i.quantity,
          totalPrice: i.totalPrice
        }
      })
    }
  }
}
