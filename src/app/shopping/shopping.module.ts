import { NgModule } from '@angular/core';
import {CheckOutComponent} from "./component/check-out/check-out.component";
import {OrdersComponent} from "../cabinet/components/orders/orders.component";
import {OrderSuccessComponent} from "./component/order-success/order-success.component";
import {ProductsComponent} from "./component/products/products.component";
import {ProductFilterComponent} from "./component/products/product-filter/product-filter.component";
import {ShippingFormComponent} from "./component/shipping-form/shipping-form.component";
import {ShoppingCartComponent} from "./component/shopping-cart/shopping-cart.component";
import {ShoppingCartSummaryComponent} from "./component/shopping-cart-summary/shopping-cart-summary.component";
import {SharedModule} from "../shared/shared.module";
import {ShoppingRoutingModule} from "./shopping-routing.module";
import {ImageThumbComponent} from "./component/image-thumb/image-thumb.component";
import {MatCardModule} from "@angular/material/card";

@NgModule({
  declarations: [
    CheckOutComponent,
    OrdersComponent,
    OrderSuccessComponent,
    ProductsComponent,
    ProductFilterComponent,
    ShippingFormComponent,
    ShoppingCartComponent,
    ShoppingCartSummaryComponent,
    ImageThumbComponent,
  ],
  exports: [],
  imports: [
    SharedModule,
    ShoppingRoutingModule,
    MatCardModule
  ]
})
export class ShoppingModule { }
