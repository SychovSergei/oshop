import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {AppUser} from "../models/app-user";
import {ShoppingCartService} from "../shopping-cart.service";
import {Observable} from "rxjs";
import {ShoppingCart} from "../models/shopping-cart";

@Component({
  selector: 'bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.scss']
})
export class BsNavbarComponent implements OnInit {
  appUser: AppUser | null;
  cart$: Observable<ShoppingCart>;
  cartItemCount: number;

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

    this.cart$ = (await this.cartService.getCart());
  }

}
