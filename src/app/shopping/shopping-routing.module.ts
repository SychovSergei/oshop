import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ProductsComponent} from "./component/products/products.component";
import {CheckOutComponent} from "./component/check-out/check-out.component";
import {AuthGuard} from "../shared/services/auth.guard";
import {OrderSuccessComponent} from "./component/order-success/order-success.component";
import {ShoppingCartComponent} from "./component/shopping-cart/shopping-cart.component";

const routes: Routes = [
  {path: 'products', component: ProductsComponent},
  {path: 'check-out', component: CheckOutComponent, canActivate: [AuthGuard]},
  {path: 'order-success/:id', component: OrderSuccessComponent, canActivate: [AuthGuard]},
  {path: 'shopping-cart', component: ShoppingCartComponent},
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ShoppingRoutingModule {}
