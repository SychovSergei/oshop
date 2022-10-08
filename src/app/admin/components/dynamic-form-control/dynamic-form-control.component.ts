import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";

export interface Control {
  key: string
  label: string
  controlType: string
  type?: string
  disabled?: boolean
  checked?: boolean
  value: any
  validators?: Validator[]
  order: number
  options?: Option[]
}

export interface Validator {
  name: string
  errorMessage: string
  value: any
}

export interface Option {
  name: string
  disabled: boolean
  categories: Category[]
}

export interface Category {
  value: string
  viewValue: string
}

@Component({
  selector: 'dynamic-form-control',
  templateUrl: './dynamic-form-control.component.html',
  styleUrls: ['./dynamic-form-control.component.scss']
})
export class DynamicFormControlComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() control: Control;

  constructor(private rootFormGroup: FormGroupDirective) {
    this.form = this.rootFormGroup.control
  }

  ngOnInit(): void {
  }

  changeValue() {
    console.log('changeValue() category = ', this.form.get('category')?.value);
  }

  getErrorMessage() {
    let err = '';
    this.control.validators?.forEach((item) => {
      if (this.form.controls[this.control.key].hasError(item.name.toLowerCase())) {
        err = item.errorMessage
      }
    })
    return err
  }

}
