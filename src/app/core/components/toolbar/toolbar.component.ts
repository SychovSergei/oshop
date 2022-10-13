import {Component, EventEmitter, OnInit, Output} from '@angular/core';
// import { faUser as regUser } from '@fortawesome/free-regular-svg-icons';
// import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
// import { faUser as solUser } from '@fortawesome/free-solid-svg-icons';
// import { FaIconLibrary} from "@fortawesome/angular-fontawesome";
import { MatIconRegistry } from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {ShoppingCartService} from "../../../shared/services/shopping-cart.service";
import {Observable} from "rxjs";
import {ShoppingCart} from "../../../shared/models/shopping-cart";
import {AuthService} from "../../../shared/services/auth.service";
import {AppUser} from "../../../shared/models/app-user";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  @Output() sideNavOpen = new EventEmitter<boolean>();

  appUser: AppUser | null;
  cart$: Observable<ShoppingCart>;

  constructor(
    private authService: AuthService,
    private cartService: ShoppingCartService,
    matIconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    matIconRegistry.addSvgIcon("cart-reg",
      sanitizer.bypassSecurityTrustResourceUrl("assets/icons/cart-reg.svg"));
    matIconRegistry.addSvgIcon('user-circle-reg',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/user-circle-reg.svg'));
    matIconRegistry.addSvgIcon('heart-reg',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/heart-reg.svg'));
  }

  async ngOnInit() {
    this.authService.appUser$.subscribe(appUser => {
      this.appUser = appUser;
      console.log(this.appUser)
    });
    this.cart$ = (await this.cartService.getCart());
  }

  openSideNav() {
    this.sideNavOpen.emit(true);
  }
}
