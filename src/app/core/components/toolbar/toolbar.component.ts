import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {ShoppingCartService} from "../../../shared/services/shopping-cart.service";
import {Observable} from "rxjs";
import {ShoppingCart} from "../../../shared/models/shopping-cart";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  @Output() sideNavOpen = new EventEmitter<boolean>();

  cart$: Observable<ShoppingCart>;

  isXSmall: boolean;

  constructor(
    private cartService: ShoppingCartService,
    private responsive: BreakpointObserver,
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
    this.responsive.observe([Breakpoints.XSmall]).subscribe((res) => {
      this.isXSmall = res.matches;
    });
    this.cart$ = (await this.cartService.getCart());
  }

  openSideNav() {
    this.sideNavOpen.emit(true);
  }
}
