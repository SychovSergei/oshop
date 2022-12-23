import {Component, OnInit} from '@angular/core';
import {AuthService} from "./shared/services/auth.service";
import {Router} from "@angular/router";
import {UserService} from "./shared/services/user.service";
import {Observable, of, switchMap} from "rxjs";
import {AppUser} from "./shared/models/app-user";
import {ShoppingCart} from "./shared/models/shopping-cart";
import {ShoppingCartService} from "./shared/services/shopping-cart.service";
import {RoutingStateService} from "./shared/services/routing-state.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'oshop';
  sideNavOpened: boolean;

  user$: Observable<AppUser | null>;
  cart$: Observable<ShoppingCart>;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private cartService: ShoppingCartService,
    private router: Router,
    private routerState: RoutingStateService
    ) {
  }

  openSideNav(event: boolean) {
    this.sideNavOpened = event;
  }

  async ngOnInit() {
    this.sideNavOpened = false;

    this.user$ = this.authService.user$
      .pipe(
        switchMap(user => {
          if (user) return this.userService.get(user?.uid!);
          return of(null);
        })
      )

    this.cart$ = (await this.cartService.getCart());

    this.routerState.recordHistory();
  }

  logout() {
    this.authService.logOut()
      .then(() => {
        this.sideNavOpened = false;
        this.router.navigate(['/']);
      });
  }

}
