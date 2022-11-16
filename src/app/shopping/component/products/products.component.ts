import {Component, OnInit} from '@angular/core';
import {Subscription, switchMap} from "rxjs";
import {ProductTypeUnion} from "../../../shared/models/product";
import {ActivatedRoute} from "@angular/router";
import {ShoppingCartService} from "../../../shared/services/shopping-cart.service";
import {ShoppingCart} from "../../../shared/models/shopping-cart";
import {ProductService} from "../../../shared/services/product.service";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {WishListService} from "../../../shared/services/wish-list.service";
import {WishList} from "../../../shared/models/wish-list";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: ProductTypeUnion[] = [];
  filteredProducts: ProductTypeUnion[] = [];
  category: string;
  cart: ShoppingCart;
  wishList: WishList;
  subCart: Subscription;
  subWish: Subscription;

  isWideScreen: boolean;
  isXLarge: boolean;
  isLarge: boolean;
  isMedium: boolean;
  isSmall: boolean;
  isXSmall: boolean;

  panelOpenState: boolean;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: ShoppingCartService,
    private wishListService: WishListService,
    private responsive: BreakpointObserver
  ) {}

  async ngOnInit() {

    this.responsive.observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge]).subscribe((res) => {
      this.isWideScreen = res.matches;
    });
    this.responsive.observe([Breakpoints.XLarge]).subscribe((res) => {
      this.isXLarge = res.matches;
    });
    this.responsive.observe([Breakpoints.Large]).subscribe((res) => {
      this.isLarge = res.matches;
    });
    this.responsive.observe([Breakpoints.Medium]).subscribe((res) => {
      this.isMedium = res.matches;
    });
    this.responsive.observe([Breakpoints.Small]).subscribe((res) => {
      this.isSmall = res.matches;
    });
    this.responsive.observe([Breakpoints.XSmall]).subscribe((res) => {
      this.isXSmall = res.matches;
    });

    this.subCart =(await this.cartService.getCart())
      .subscribe(cart => {this.cart = cart;})

    this.subWish = this.wishListService.getWishList()
      .subscribe((list) => { this.wishList = list; });

    this.populateProducts();
  }

  private populateProducts() {

    this.productService.getAll()
      .pipe(
        switchMap((products: ProductTypeUnion[]) => {
          this.products = products;
          return this.route.queryParamMap;
        })
      )
      .subscribe(params => {
        this.category = params.get('category')!;
        this.applyFilter();
      });

  }

  private applyFilter() {
    this.filteredProducts = (this.category)
      ? this.products.filter((p) => p.category === this.category)
      : this.products;
  }

  ngOnDestroy() {
    this.subCart.unsubscribe();
    this.subWish.unsubscribe();
  }

}
