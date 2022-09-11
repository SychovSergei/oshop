import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProductsComponent} from "./shopping/component/products/products.component";
import {ShoppingCartComponent} from "./shopping/component/shopping-cart/shopping-cart.component";
import {LoginComponent} from "./core/components/login/login.component";
import {CheckOutComponent} from "./shopping/component/check-out/check-out.component";
import {AuthGuard} from "./shared/services/auth.guard";
import {OrderSuccessComponent} from "./shopping/component/order-success/order-success.component";
import {MyOrdersComponent} from "./shopping/component/my-orders/my-orders.component";

const routes: Routes = [
  {path: '', component: ProductsComponent},
  {path: 'login', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
