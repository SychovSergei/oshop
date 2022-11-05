import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../../shared/services/auth.service";
import {AuthDialogName} from "../../../../shared/models/identification-dialog";
import {RegisterUser} from "../../../../shared/models/register-user";
import {UserService} from "../../../../shared/services/user.service";
import {CustomValidators} from "./custom-validators";
import {PasswordValidators} from "./password-validators";
import {UniqueValueValidator} from "./unique-value-validator";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Output() switchForm = new EventEmitter<AuthDialogName>();
  @Output() success = new EventEmitter<boolean>();

  form: FormGroup;
  hide = true;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private uniqueValidator: UniqueValueValidator
  ) {}

  ngOnInit(): void {
    const registerForm: any = {};
    if (localStorage.getItem('registerForm')) {
      for (const registerFormKey in JSON.parse(localStorage.getItem('registerForm')!)) {
        registerForm[registerFormKey] = JSON.parse(localStorage.getItem('registerForm')!)[registerFormKey]
      }
    }

    this.form = new FormGroup({
      firstname: new FormControl(registerForm['firstname'] || '', [
        Validators.required
      ]),
      lastname: new FormControl(registerForm['lastname'] || '', [
        Validators.required
      ]),
      email: new FormControl(
        registerForm['email'] || '',
        {
          validators: [ Validators.required, Validators.email ],
          asyncValidators: [this.uniqueValidator.validate.bind(this.uniqueValidator)],
          updateOn: 'blur'
        }
      ),
      password: new FormControl('Password1!',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          PasswordValidators.patternValidator(new RegExp("(?=.*[0-9])"), {
            requiresDigit: true
          }),
          PasswordValidators.patternValidator(new RegExp("(?=.*[A-Z])"), {
            requiresUppercase: true
          }),
          PasswordValidators.patternValidator(new RegExp("(?=.*[a-z])"), {
            requiresLowercase: true
          }),
          PasswordValidators.patternValidator(new RegExp("(?=.*[$@^!%*?&])"), {
            requiresSpecialChars: true
          })
      ])),
      confirmPassword: new FormControl('Password1!', [
        Validators.required
      ])
      },
      {
        validators: [ CustomValidators.match('password', 'confirmPassword') ]
      });

  }

  switchToLogin() {
    this.rememberRegisterForm();
    this.switchForm.emit('login');
  }

  async register() {
    const data: RegisterUser = {
      email: this.form.value.email,
      password: this.form.value.password,
      firstname: this.form.value.firstname,
      lastname: this.form.value.lastname
    };

    const user = await this.authService.createUserWithEmailAndPassword(data);
    await this.userService.save(user);
    this.success.emit(true);
  }

  private rememberRegisterForm() {
    const localForm: any = {};
    for (let valueKey in this.form.value) {
      if (valueKey !== "password" && valueKey !== "confirmPassword") {
        localForm[valueKey] = this.form.value[valueKey];
      }
    }
    localStorage.setItem('registerForm', JSON.stringify(localForm));
  }


}
