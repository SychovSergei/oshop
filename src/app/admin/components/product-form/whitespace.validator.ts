import { AbstractControl } from '@angular/forms';

export function ValidateStartsEndsWhiteSpace(control: AbstractControl) {
  if (control.value.startsWith(' ') || control.value.endsWith(' ')) {
    return { whitespace: true };
  }
  return null;
}
