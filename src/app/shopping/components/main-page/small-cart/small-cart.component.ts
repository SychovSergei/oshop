import {Component, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {ShoppingCartService} from "../../../../shared/services/shopping-cart.service";
import {Observable} from "rxjs";
import {ShoppingCart} from "../../../../shared/models/shopping-cart";

@Component({
  selector: 'app-small-cart',
  templateUrl: './small-cart.component.html',
  styleUrls: ['./small-cart.component.scss']
})
export class SmallCartComponent implements OnInit {

  cart$: Observable<ShoppingCart>;
  cart: ShoppingCart;
  isPhoneUpperScreen: boolean;

  constructor(
    private cartService: ShoppingCartService,
    private responsive: BreakpointObserver
  ) { }

  ngOnInit() {
    this.responsive.observe([
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge]).subscribe((res) => {
      this.isPhoneUpperScreen = res.matches;
    });

    this.cartService.getCart()
      .then((cart) => {
        this.cart$ = cart;
      })
  }

}
