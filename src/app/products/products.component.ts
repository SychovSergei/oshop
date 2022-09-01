import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription, switchMap} from "rxjs";
import {ProductService} from "../product.service";
import {Product} from "../models/product";
import {ActivatedRoute} from "@angular/router";
import {ShoppingCartService} from "../shopping-cart.service";
import {ShoppingCart} from "../models/shopping-cart";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  category: string;
  cart: ShoppingCart;
  subCart: Subscription;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: ShoppingCartService
  ) {
    productService.getAll()
      .pipe(
        switchMap((products) => {
          this.products = products;
          return route.queryParamMap;
        })
      )
      .subscribe(params => {
        this.category = params.get('category')!;
        this.filteredProducts = (this.category)
            ? this.products.filter((p) => p.category === this.category)
            : this.products;
      });
  }

  async ngOnInit() {
    let cart$ = await this.cartService.getCart();
    this.subCart = cart$.subscribe(cart => {
      this.cart = cart!;
    })
  }

  ngOnDestroy() {
    this.subCart.unsubscribe();
  }

}
