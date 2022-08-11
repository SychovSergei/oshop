import {Component, OnDestroy} from '@angular/core';
import {AuthService} from "../auth.service";

@Component({
  selector: 'bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.scss']
})
export class BsNavbarComponent implements OnDestroy{
  constructor(public authService: AuthService) {}

  logOut() {
    this.authService.logOut();
  }

  ngOnDestroy(): void {
  }

}
