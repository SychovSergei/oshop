import {Component, Input, OnInit} from '@angular/core';
import {ShoppingCartItem} from "../../../shared/models/shopping-cart-item";

export interface CartItem {
  title: string;
  price: number;
  imageThumbUrl: string;
  quantity: number;
}

@Component({
  selector: 'image-thumb',
  templateUrl: './image-thumb.component.html',
  styleUrls: ['./image-thumb.component.scss']
})
export class ImageThumbComponent implements OnInit {
  @Input() url: string;

  constructor() { }

  ngOnInit(): void {
  }

}
