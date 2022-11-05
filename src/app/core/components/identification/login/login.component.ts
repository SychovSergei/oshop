import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {IdentificationComponent} from "../identification.component";
import {AuthService} from "../../../../shared/services/auth.service";
import {AuthDialogName} from "../../../../shared/models/identification-dialog";
import {NotifierService} from "angular-notifier";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private readonly notifier: NotifierService;
  @Output() switchForm = new EventEmitter<AuthDialogName>();
  @Output() success = new EventEmitter<boolean>();

  form: FormGroup;
  hide = true;

  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<IdentificationComponent>,
    private notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

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
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  switchToResetPassword(e: Event) {
    e.preventDefault();
    this.rememberLoginForm();
    this.switchForm.emit('resetPassword');
  }

  switchToRegister() {
    this.rememberLoginForm();
    this.switchForm.emit('register');
  }

  login() {
    this.authService.loginWithEmailAndPassword(this.form.value.email,this.form.value.password)
      .then(() => {
        this.success.emit(true);
      })
  }

  private rememberLoginForm() {
    const localForm: any = {};
    for (let valueKey in this.form.value) {
      if (valueKey !== "password") {
        localForm[valueKey] = this.form.value[valueKey];
      }
    }
    localStorage.setItem('loginForm', JSON.stringify(localForm));
  }

}
