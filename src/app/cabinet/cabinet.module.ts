import {NgModule} from "@angular/core";
import { CabinetComponent } from './components/cabinet/cabinet.component';
import { WishListComponent } from './components/wish-list/wish-list.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { PersonalInformationComponent } from './components/personal-information/personal-information.component';
import { RecentlyViewedComponent } from './components/recently-viewed/recently-viewed.component';
import { CabinetRoutingModule } from "./cabinet-routing.module";

@NgModule({
  declarations: [
    WishListComponent,
    ReviewsComponent,
    PersonalInformationComponent,
    RecentlyViewedComponent,
    CabinetComponent
  ],
  imports: [
    CabinetRoutingModule
  ],
  exports: [
    CabinetRoutingModule
  ]
})
export class CabinetModule {}
