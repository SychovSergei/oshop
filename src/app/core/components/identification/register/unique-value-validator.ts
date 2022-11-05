import {Injectable} from "@angular/core";
import {AbstractControl, AsyncValidator, ValidationErrors} from "@angular/forms";
import {AuthService} from "../../../../shared/services/auth.service";

@Injectable({
  providedIn: 'root'
})

export class UniqueValueValidator implements AsyncValidator {
  constructor(private authService: AuthService) {
  }

  validate(control: AbstractControl): Promise<ValidationErrors | null> {
    return this.authService.isUniqueEmail(control.value)
      .then((res: boolean) => {
        return res ? null : { emailExists: true };
      })
  }

}
