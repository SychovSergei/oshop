import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../shared/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router) {}

  ngOnInit(): void {
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle()
      .then(() => { this.router.navigate(['/']) });
  }

}
