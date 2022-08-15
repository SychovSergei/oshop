import {Component, OnDestroy} from '@angular/core';
import {AuthService} from "../auth.service";
import {AppUser} from "../models/app-user";

@Component({
  selector: 'bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.scss']
})
export class BsNavbarComponent implements OnDestroy {
  appUser: AppUser | null;

  constructor(private authService: AuthService) {
    authService.appUser$.subscribe(appUser => this.appUser = appUser)
  }

  logOut() {
    this.authService.logOut();
  }

  ngOnDestroy(): void {
  }

}
