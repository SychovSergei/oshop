import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {ShoppingCartService} from "../../../shared/services/shopping-cart.service";
import {Observable} from "rxjs";
import {ShoppingCart} from "../../../shared/models/shopping-cart";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {IdentificationComponent} from "../identification/identification.component";
import firebase from "firebase/compat";
import {AuthService} from "../../../shared/services/auth.service";
import {WishListService} from "../../../shared/services/wish-list.service";
import {WishList} from "../../../shared/models/wish-list";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  @Output() sideNavOpen = new EventEmitter<boolean>();
  user$: Observable<firebase.User | null>
  cart$: Observable<ShoppingCart>;
  wishList$: Observable<WishList>;

  isXSmall: boolean;

  constructor(
    private authService: AuthService,
    private cartService: ShoppingCartService,
    private wishListService: WishListService,
    private responsive: BreakpointObserver,
    matIconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public dialog: MatDialog
  ) {
    matIconRegistry.addSvgIcon("cart-reg",
      sanitizer.bypassSecurityTrustResourceUrl("assets/icons/cart-reg.svg"));
    matIconRegistry.addSvgIcon('user-circle-reg',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/user-circle-reg.svg'));
    matIconRegistry.addSvgIcon('heart-reg',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/heart-reg.svg'));
  }

  async ngOnInit() {
    this.user$ = this.authService.user$;
    this.responsive.observe([Breakpoints.XSmall]).subscribe((res) => {
      this.isXSmall = res.matches;
    });
    this.cart$ = (await this.cartService.getCart());
    this.wishList$ = this.wishListService.getWishList();
  }

  openSideNav() {
    this.sideNavOpen.emit(true);
  }

  openDialog(initial: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.disableClose = false;
    dialogConfig.data = {
      dialogName: initial,
    };

    if (this.isXSmall) {
      dialogConfig.panelClass = 'fullscreen-auth-dialog';
    } else {
      dialogConfig.panelClass = 'auth-dialog';
    }

    const dialogRef = this.dialog.open(IdentificationComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {});
  }

}
