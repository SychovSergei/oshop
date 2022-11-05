import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../../shared/services/auth.service";
import {AuthDialogName} from "../../../../shared/models/identification-dialog";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  @Output() switchForm = new EventEmitter<AuthDialogName>();

  form: FormGroup;

  constructor(
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const loginForm: any = {};
    if (localStorage.getItem('loginForm')) {
      for (const loginFormKey in JSON.parse(localStorage.getItem('loginForm')!)) {
        loginForm[loginFormKey] = JSON.parse(localStorage.getItem('loginForm')!)[loginFormKey]
      }
    }

    this.form = new FormGroup({
      email: new FormControl( loginForm['email'] || '', [
        Validators.required,
        Validators.email
      ])
    });
  }

  switchToLogin() {
    this.switchForm.emit('login');
  }

  resetPassword() {
    this.authService.resetPassword(this.form.value['email']);
  }

}
