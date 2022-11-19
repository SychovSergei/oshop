import { NgModule } from '@angular/core';
import {CheckOutComponent} from "./components/check-out/check-out.component";
import {OrdersComponent} from "../cabinet/components/orders/orders.component";
import {OrderSuccessComponent} from "./components/order-success/order-success.component";
import {ProductsComponent} from "./components/products/products.component";
import {ProductFilterComponent} from "./components/products/product-filter/product-filter.component";
import {ShippingFormComponent} from "./components/shipping-form/shipping-form.component";
import {ShoppingCartComponent} from "./components/shopping-cart/shopping-cart.component";
import {ShoppingCartSummaryComponent} from "./components/shopping-cart-summary/shopping-cart-summary.component";
import {SharedModule} from "../shared/shared.module";
import {ShoppingRoutingModule} from "./shopping-routing.module";
import {ImageThumbComponent} from "./components/image-thumb/image-thumb.component";
import {MatCardModule} from "@angular/material/card";
import { MainPageComponent } from "./components/main-page/main-page.component";
import { MainPageSidebarComponent } from './components/main-page/main-page-sidebar/main-page-sidebar.component';
import { SidebarMenuComponent } from './components/main-page/sidebar-menu/sidebar-menu.component';
import { MainPageContentComponent } from './components/main-page/main-page-content/main-page-content.component';
import { SmallCartComponent } from "./components/main-page/small-cart/small-cart.component";

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
    MainPageComponent,
    MainPageSidebarComponent,
    SidebarMenuComponent,
    MainPageContentComponent,
    SmallCartComponent,
  ],
  exports: [],
  imports: [
    SharedModule,
    ShoppingRoutingModule,
    MatCardModule
  ]
})
export class ShoppingModule { }
