import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AbstractProdItemDetail} from "../../../../shared/models/product";

@Component({
  selector: 'app-notebook-detail',
  templateUrl: './notebook-detail.component.html',
  styleUrls: ['./notebook-detail.component.scss']
})
export class NotebookDetailComponent extends AbstractProdItemDetail {

  constructor() {
    super();
    this.childForm = new FormGroup({
      screen_diagonal: new FormControl(''),
      screen_type: new FormControl(''),
      processor_cpu: new FormControl('')
    })
  }

}
