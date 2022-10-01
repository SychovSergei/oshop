import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProductCardComponent} from "../shopping/component/products/product-card/product-card.component";
import {ProductQuantityComponent} from "./components/product-quantity/product-quantity.component";

import {AuthGuard} from "./services/auth.guard";
import {AuthService} from "./services/auth.service";
import {CategoryService} from "./services/category.service";
import {ProductService} from "./services/product.service";
import {ShoppingCartService} from "./services/shopping-cart.service";
import {OrderService} from "./services/order.service";
import {UserService} from "./services/user.service";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {CarouselImageComponent} from "./components/carousel-image/carousel-image.component";

@NgModule({
  declarations: [
    ProductCardComponent,
    ProductQuantityComponent,
    CarouselImageComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
  ],
  exports: [
    CommonModule,
    ProductCardComponent,
    ProductQuantityComponent,
    NgbModule,
  ],
  providers: [
    AuthService,
    AuthGuard,
    CategoryService,
    OrderService,
    ProductService,
    ShoppingCartService,
    UserService,
  ]
})
export class SharedModule { }
