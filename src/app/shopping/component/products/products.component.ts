import {Component, OnInit} from '@angular/core';
import {Subscription, switchMap} from "rxjs";
import {Product} from "../../../shared/models/product";
import {ActivatedRoute} from "@angular/router";
import {ShoppingCartService} from "../../../shared/services/shopping-cart.service";
import {ShoppingCart} from "../../../shared/models/shopping-cart";
import {ProductService} from "../../../shared/services/product.service";

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

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: ShoppingCartService
  ) {

  }

  async ngOnInit() {
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
