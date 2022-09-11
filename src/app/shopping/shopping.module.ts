import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CheckOutComponent} from "./component/check-out/check-out.component";
import {MyOrdersComponent} from "./component/my-orders/my-orders.component";
import {OrderSuccessComponent} from "./component/order-success/order-success.component";
import {ProductsComponent} from "./component/products/products.component";
import {ProductFilterComponent} from "./component/products/product-filter/product-filter.component";
import {ShippingFormComponent} from "./component/shipping-form/shipping-form.component";
import {ShoppingCartComponent} from "./component/shopping-cart/shopping-cart.component";
import {ShoppingCartSummaryComponent} from "./component/shopping-cart-summary/shopping-cart-summary.component";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import {ShoppingRoutingModule} from "./shopping-routing.module";

@NgModule({
  declarations: [
    CheckOutComponent,
    MyOrdersComponent,
    OrderSuccessComponent,
    ProductsComponent,
    ProductFilterComponent,
    ShippingFormComponent,
    ShoppingCartComponent,
    ShoppingCartSummaryComponent,
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    ShoppingRoutingModule
  ]
})
export class ShoppingModule { }
