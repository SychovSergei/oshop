import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {AppUser} from "../models/app-user";
import {ShoppingCartService} from "../shopping-cart.service";
import {Observable, Subscription} from "rxjs";
import {ShoppingCart} from "../models/shopping-cart";

@Component({
  selector: 'bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.scss']
})
export class BsNavbarComponent implements OnInit, OnDestroy {
  appUser: AppUser | null;
  cart$: Observable<ShoppingCart | null>;
  cartQuantity: number;
  subCart: Subscription;

  constructor(
    private authService: AuthService,
    private cartService: ShoppingCartService
    ) {
  }

  logOut() {
    this.authService.logOut();
  }

  async ngOnInit() {
    this.authService.appUser$.subscribe(appUser => this.appUser = appUser)
    this.cart$ = await this.cartService.getCart();
    this.subCart = this.cart$.subscribe(cart => {
      if (cart) this.cartQuantity = cart.totalItemsCount;
      // console.log('NAVBAR this.cart = ', this.cart);
    })
  }

  ngOnDestroy(): void {
    this.subCart.unsubscribe();
  }


}
