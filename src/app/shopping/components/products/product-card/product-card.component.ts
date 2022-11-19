import {Component, Input, OnInit} from '@angular/core';
import {ProductTypeUnion} from "../../../../shared/models/product";
import {ShoppingCartService} from "../../../../shared/services/shopping-cart.service";
import {ShoppingCart} from "../../../../shared/models/shopping-cart";

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Input('product') product: ProductTypeUnion;
  @Input('show-actions') showActions: boolean = true;
  @Input('shopping-cart') shoppingCart: ShoppingCart;

  constructor(
    private cartService: ShoppingCartService
  ) { }

  ngOnInit() {
  }

  addToCart() {
    this.cartService.addToCart(this.product);
  }

  convertToArray(images: any) {
    const res: any = [];
    const objArray = Object.keys(images);
    objArray.forEach((key) => {
      res.push(images[key])
    })
    return res;
  }
}
