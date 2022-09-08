import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../../models/product";
import {ShoppingCartService} from "../../shopping-cart.service";
import {ShoppingCart} from "../../models/shopping-cart";

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Input('product') product: Product;
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

}
