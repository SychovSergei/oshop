import {Component, OnInit} from '@angular/core';
import {AuthService} from "./shared/services/auth.service";
import {Router} from "@angular/router";
import {UserService} from "./shared/services/user.service";
import {Observable} from "rxjs";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {AppUser} from "./shared/models/app-user";
import {ShoppingCart} from "./shared/models/shopping-cart";
import {ShoppingCartService} from "./shared/services/shopping-cart.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'oshop';
  sideNavOpened: boolean;

  user$: Observable<any>
  appUser: AppUser | null;
  appUser$: Observable<AppUser | null>;
  cart$: Observable<ShoppingCart>;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private cartService: ShoppingCartService,
    private router: Router,
    matIconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
    ) {
    this.sideNavOpened = false;

    matIconRegistry.addSvgIcon('user-circle-reg',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/user-circle-reg.svg'));

    authService.user$.subscribe(user => {
      if (!user) return;

      userService.save(user);

    })
  }

  openSideNav(event: boolean) {
    this.sideNavOpened = event;
  }

  async ngOnInit() {
    this.user$ = this.authService.user$;
    this.appUser$ = this.authService.appUser$;
    this.cart$ = (await this.cartService.getCart());
  }

  logOut() {
    this.authService.logOut()
      .then(() => {
        this.sideNavOpened = false;
        this.router.navigate(['/']);
      });
  }

  login() {
    this.router.navigate(['/login'])
      .then(() => { this.sideNavOpened = false });
  }

  register() {

  }
}
