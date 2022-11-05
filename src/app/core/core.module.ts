import {NgModule} from "@angular/core";
import { AuthAvatarComponent } from './components/auth-avatar/auth-avatar.component';
import {HomeComponent} from "./components/home/home.component";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../shared/shared.module";
import {ToolbarComponent} from "./components/toolbar/toolbar.component";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import { FooterComponent } from './components/footer/footer.component';
import { IdentificationComponent } from './components/identification/identification.component';
import { RegisterComponent } from './components/identification/register/register.component';
import { LoginComponent } from "./components/identification/login/login.component";
import { ResetPasswordComponent } from './components/identification/reset-password/reset-password.component';
import { AuthSocialComponent } from './components/identification/auth-social/auth-social.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@NgModule({
  declarations: [
    AuthAvatarComponent,
    HomeComponent,
    ToolbarComponent,
    FooterComponent,
    IdentificationComponent,
    RegisterComponent,
    LoginComponent,
    ResetPasswordComponent,
    AuthSocialComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([]),
    MatSidenavModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  exports: [
    AuthAvatarComponent,
    ToolbarComponent,
    FooterComponent,
  ]
})

export class CoreModule {}
