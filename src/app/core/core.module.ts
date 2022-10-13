import {NgModule} from "@angular/core";
import {BsNavbarComponent} from "./components/bs-navbar/bs-navbar.component";
import {HomeComponent} from "./components/home/home.component";
import {LoginComponent} from "./components/login/login.component";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../shared/shared.module";
import {ToolbarComponent} from "./components/toolbar/toolbar.component";
import { SideNavComponent } from './components/side-nav/side-nav.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";

@NgModule({
  declarations: [
    BsNavbarComponent,
    HomeComponent,
    LoginComponent,
    ToolbarComponent,
    SideNavComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([]),
    MatSidenavModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  exports: [
    BsNavbarComponent,
    ToolbarComponent,
    SideNavComponent
  ]
})

export class CoreModule {}
