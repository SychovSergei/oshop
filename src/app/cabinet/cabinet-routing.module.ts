import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {OrdersComponent} from "./components/orders/orders.component";
import {WishListComponent} from "./components/wish-list/wish-list.component";
import {PersonalInformationComponent} from "./components/personal-information/personal-information.component";
import {ReviewsComponent} from "./components/reviews/reviews.component";
import {RecentlyViewedComponent} from "./components/recently-viewed/recently-viewed.component";
import {CabinetComponent} from "./components/cabinet/cabinet.component";
import {AuthGuard} from "../shared/services/auth.guard";

const routes: Routes = [
  {
    path: 'cabinet',
    component: CabinetComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'personal-info',
        component: PersonalInformationComponent,
      },
      {
        path: 'orders',
        component: OrdersComponent,
      },
      {
        path: 'wishlist',
        component: WishListComponent,
      },
      {
        path: 'reviews',
        component: ReviewsComponent,
      },
      {
        path: 'recently-viewed',
        component: RecentlyViewedComponent,
      }
    ],
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CabinetRoutingModule {}
