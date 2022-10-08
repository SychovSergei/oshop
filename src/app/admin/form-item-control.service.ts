import {Injectable} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Control} from "./components/dynamic-form-control/dynamic-form-control.component";

@Injectable()
export class FormItemControlService {
  constructor() {
  }

  createFormGroupDynamic(controls: Control[]) {
    const group: any = {};
    controls.forEach(control => {
      const validators: any = [];
      control.validators?.forEach((validItem) => {
        switch (validItem.name) {
          case 'required':
            validators.push(Validators.required);
            break;
          case 'requiredTrue':
            validators.push(Validators.requiredTrue);
            break;
          case 'email':
            validators.push(Validators.email);
            break;
          case 'nullValidator':
            validators.push(Validators.nullValidator);
            break;
          case 'minLength':
            validators.push(Validators.minLength(validItem.value!));
            break;
          case 'maxLength':
            validators.push(Validators.maxLength(validItem.value!));
            break;
          case 'pattern':
            validators.push(Validators.pattern(validItem.value!));
            break;
          case 'min':
            validators.push(Validators.min(validItem.value!));
            break;
          case 'max':
            validators.push(Validators.max(validItem.value!));
            break;
        }
      })
      group[control.key] = new FormControl(control.value, validators);
    });
    return new FormGroup(group);
  }

}
