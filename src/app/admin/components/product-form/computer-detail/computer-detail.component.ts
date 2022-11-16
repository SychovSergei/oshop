import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AbstractProdItemDetail} from "../../../../shared/models/product";

@Component({
  selector: 'app-computer-detail',
  templateUrl: './computer-detail.component.html',
  styleUrls: ['./computer-detail.component.scss']
})
export class ComputerDetailComponent extends AbstractProdItemDetail {

  constructor() {
    super();
    this.childForm = new FormGroup({
      screen_diagonal: new FormControl(''),
    })
  }


}
