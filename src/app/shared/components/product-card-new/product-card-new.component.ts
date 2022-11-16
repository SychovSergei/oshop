import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ProductTypeUnion, ProductImage} from "../../models/product";
import {ShoppingCart} from "../../models/shopping-cart";
import {ShoppingCartService} from "../../services/shopping-cart.service";
import {Router} from "@angular/router";
import {WishListService} from "../../services/wish-list.service";
import {AuthService} from "../../services/auth.service";
import {Observable} from "rxjs";
import firebase from "firebase/compat";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {IdentificationComponent} from "../../../core/components/identification/identification.component";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {WishList} from "../../models/wish-list";

@Component({
  selector: 'product-card-new',
  templateUrl: './product-card-new.component.html',
  styleUrls: ['./product-card-new.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardNewComponent implements OnInit {
  @Input('product') product: ProductTypeUnion;
  @Input('shopping-cart') shoppingCart: ShoppingCart;
  @Input('wish-list') wList: WishList;

  private imgDefaultUrl: string;
  user$: Observable<firebase.User | null>;
  isXSmall: boolean;

  constructor(
    private authService: AuthService,
    private cartService: ShoppingCartService,
    private responsive: BreakpointObserver,
    private wishlistService: WishListService,
    private router: Router,
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {
    this.user$ = this.authService.user$;

    this.responsive.observe([Breakpoints.XSmall]).subscribe((res) => {
      this.isXSmall = res.matches;
    });
    if (!!this.product) {
      if (this.product.images === undefined) {
        this.product.images = [];
      }
    }
    this.imgDefaultUrl = 'assets/images/products/default/img_default.jpg';
  }

  getPrice() {
    let price = this.product.price;
    if (this.product.discount > 0) {
      price = this.product.price - this.product.price * this.product.discount / 100;
    }
    return price;
  }

  addToCart() {
    this.cartService.addToCart(this.product);
  }

  goToCart() {
    this.router.navigate(['/shopping-cart']);
  }

  private objToArray(imagesObj: {[key: string]: ProductImage}) {
    const res: ProductImage[] = [];
    if (Object.keys(imagesObj).length > 0) {
      for (const key of Object.keys(imagesObj)) {
        res[Number(key)] = imagesObj[key];
      }
    }
    return res;
  }

  getImgUrl(productImages: any) {
    const arr = this.objToArray(productImages);
    return arr.length > 0 ? arr[0].url : this.imgDefaultUrl;
  }

  updWishlist() {
    this.wishlistService.updateWishList(this.product);
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
