import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from "../../../../shared/services/auth.service";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {UserService} from "../../../../shared/services/user.service";

@Component({
  selector: 'app-auth-social',
  templateUrl: './auth-social.component.html',
  styleUrls: ['./auth-social.component.scss']
})
export class AuthSocialComponent implements OnInit {
  @Output() success = new EventEmitter<boolean>();

  constructor(
    private authService: AuthService,
    private userService: UserService,
    matIconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
  ) {
    matIconRegistry.addSvgIcon('facebook',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/facebook.svg'));
    matIconRegistry.addSvgIcon('google',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/google.svg'));
  }

  ngOnInit(): void {
  }

  async loginWithFacebook() {
    const userCred = await this.authService.loginWithFacebook();
    if (userCred) {
      await this.userService.save(userCred);
      this.success.emit(true);
    }
  }

  async loginWithGoogle() {
    const userCred = await this.authService.loginWithGoogle();
    await this.userService.save(userCred);
    this.success.emit(true);
  }
}
