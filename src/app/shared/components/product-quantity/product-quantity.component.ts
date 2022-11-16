import {Component, Input, OnInit} from '@angular/core';
import {ProductTypeUnion} from "../../models/product";
import {ShoppingCart} from "../../models/shopping-cart";
import {ShoppingCartService} from "../../services/shopping-cart.service";

@Component({
  selector: 'product-quantity',
  templateUrl: './product-quantity.component.html',
  styleUrls: ['./product-quantity.component.scss']
})
export class ProductQuantityComponent implements OnInit {
  @Input() product: ProductTypeUnion;
  @Input('shopping-cart') shoppingCart: ShoppingCart;

  constructor(private cartService: ShoppingCartService) {}

  ngOnInit() {
  }

  addToCart() {
    this.cartService.addToCart(this.product);
  }

  removeFromCart() {
    this.cartService.removeFromCart(this.product);
  }


}
