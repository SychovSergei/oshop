import {Component, OnInit} from '@angular/core';
import {ShoppingCartService} from "../../../shared/services/shopping-cart.service";
import {ShoppingCart} from "../../../shared/models/shopping-cart";
import {Observable} from "rxjs";

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit {
  cart$: Observable<ShoppingCart>;

  constructor(private shoppingCartService: ShoppingCartService) {}

  async ngOnInit() {
    this.cart$ = (await this.shoppingCartService.getCart());
  }

}
