import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../shared/services/auth.service";
import {AppUser} from "../../../shared/models/app-user";
import {ShoppingCartService} from "../../../shared/services/shopping-cart.service";
import {Observable} from "rxjs";
import {ShoppingCart} from "../../../shared/models/shopping-cart";
import {Router} from "@angular/router";

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
    private cartService: ShoppingCartService,
    private router: Router
    ) {
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/']);
  }

  async ngOnInit() {
    this.authService.appUser$.subscribe(appUser => this.appUser = appUser)

    this.cart$ = (await this.cartService.getCart());
  }

}
