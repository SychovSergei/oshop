import {NgModule} from "@angular/core";
import { AuthAvatarComponent } from './components/auth-avatar/auth-avatar.component';
import {HomeComponent} from "./components/home/home.component";
import {LoginComponent} from "./components/login/login.component";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../shared/shared.module";
import {ToolbarComponent} from "./components/toolbar/toolbar.component";
import { SideNavComponent } from './components/side-nav/side-nav.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    AuthAvatarComponent,
    HomeComponent,
    LoginComponent,
    ToolbarComponent,
    SideNavComponent,
    FooterComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([]),
    MatSidenavModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  exports: [
    AuthAvatarComponent,
    ToolbarComponent,
    SideNavComponent,
    FooterComponent
  ]
})

export class CoreModule {}
