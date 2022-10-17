import {Component, OnInit} from '@angular/core';
import {map, Observable, Subscription, switchMap, tap} from "rxjs";
import {Product} from "../../../shared/models/product";
import {ActivatedRoute} from "@angular/router";
import {ShoppingCartService} from "../../../shared/services/shopping-cart.service";
import {ShoppingCart} from "../../../shared/models/shopping-cart";
import {ProductService} from "../../../shared/services/product.service";
import {BreakpointObserver, BreakpointState, Breakpoints} from "@angular/cdk/layout";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  category: string;
  cart: ShoppingCart;
  subCart: Subscription;

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
    // .pipe(tap((mmm) => {console.log('State', mmm)}))

    this.subCart =(await this.cartService.getCart())
      .subscribe(cart => {this.cart = cart;})
    this.populateProducts();
  }

  private populateProducts() {

    this.productService.getAll()
      .pipe(
        switchMap((products) => {
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
  }

}
