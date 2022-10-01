import {Component, Input, OnInit} from '@angular/core';
import {ShoppingCart} from "../../../../shared/models/shopping-cart";
import {Product, ProductNew} from "../../../../shared/models/product";
import {ShoppingCartService} from "../../../../shared/services/shopping-cart.service";

@Component({
  selector: 'product-card-new',
  templateUrl: './product-card-new.component.html',
  styleUrls: ['./product-card-new.component.scss']
})
export class ProductCardNewComponent implements OnInit {
  @Input('product') productNew: ProductNew;
  @Input('shopping-cart') shoppingCart: ShoppingCart;

  constructor(private cartService: ShoppingCartService) { }

  ngOnInit(): void {
  }

  addToCart() {
    this.cartService.addToCart(this.productNew);
  }

}
