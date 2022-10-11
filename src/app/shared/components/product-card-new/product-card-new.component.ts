import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Product, ProductImage} from "../../models/product";
import {ShoppingCart} from "../../models/shopping-cart";
import {ShoppingCartService} from "../../services/shopping-cart.service";
import {Router} from "@angular/router";

@Component({
  selector: 'product-card-new',
  templateUrl: './product-card-new.component.html',
  styleUrls: ['./product-card-new.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardNewComponent implements OnInit {
  @Input('product') product: Product;
  @Input('shopping-cart') shoppingCart: ShoppingCart;

  private imgDefaultUrl: string;

  constructor(
    private cartService: ShoppingCartService,
    private router: Router
    ) { }

  ngOnInit(): void {
    if (!!this.product) {
      if (this.product.images === undefined) {
        this.product.images = [];
      }
    }
    this.imgDefaultUrl = 'assets/images/products/default/img_default.jpg';
  }

  getPrice() {
    let price = this.product.price;
    if (this.product.discount > 0) {
      price = this.product.price - this.product.price * this.product.discount / 100;
    }
    return price;
  }

  addToCart() {
    this.cartService.addToCart(this.product);
  }

  goToCart() {
    this.router.navigate(['/shopping-cart']);
  }

  private objToArray(imagesObj: {[key: string]: ProductImage}) {
    const res: ProductImage[] = [];
    if (Object.keys(imagesObj).length > 0) {
      for (const key of Object.keys(imagesObj)) {
        res[Number(key)] = imagesObj[key];
      }
    }
    console.log(res)
    return res;
  }

  getImgUrl(productImages: any) {
    const arr = this.objToArray(productImages);
    return arr.length > 0 ? arr[0].url : this.imgDefaultUrl;
  }
}
