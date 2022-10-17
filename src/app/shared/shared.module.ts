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
import { DialogBoxComponent } from './components/dialog-box/dialog-box.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";
import {ProductCardNewComponent} from "./components/product-card-new/product-card-new.component";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule, MatIconRegistry} from "@angular/material/icon";
import { NgxStarRatingModule } from 'ngx-star-rating';
import {MatToolbarModule} from "@angular/material/toolbar";
import{ FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import {MatBadgeModule} from "@angular/material/badge";
import {HttpClientModule} from "@angular/common/http";
import {LayoutModule} from "@angular/cdk/layout";
import {MatExpansionModule} from "@angular/material/expansion";

@NgModule({
  declarations: [
    ProductCardComponent,
    ProductQuantityComponent,
    CarouselImageComponent,
    DialogBoxComponent,
    ProductCardNewComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatToolbarModule,
    NgxStarRatingModule,
    MatBadgeModule,
    MatExpansionModule,

    HttpClientModule,
    MatIconModule,
    FontAwesomeModule,
    LayoutModule,
  ],
  exports: [
    CommonModule,
    ProductCardComponent,
    ProductQuantityComponent,
    NgbModule,
    ProductCardNewComponent,
    NgxStarRatingModule,
    MatToolbarModule,
    MatButtonModule,
    FontAwesomeModule,
    MatBadgeModule,
    ReactiveFormsModule,
    MatExpansionModule,

    MatIconModule,
    HttpClientModule,
  ],
  providers: [
    AuthService,
    AuthGuard,
    CategoryService,
    OrderService,
    ProductService,
    ShoppingCartService,
    UserService,

    MatIconRegistry
  ]
})
export class SharedModule { }
