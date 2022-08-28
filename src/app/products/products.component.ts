import { Component, OnInit } from '@angular/core';
import {switchMap} from "rxjs";
import {ProductService} from "../product.service";
import {Product} from "../models/product";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  category: string;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {
    productService.getAll()
      .pipe(
        switchMap((products) => {
          this.products = products;
          return route.queryParamMap;
        })
      )
      .subscribe(params => {
        this.category = params.get('category')!;
        this.filteredProducts = (this.category)
            ? this.products.filter((p) => p.category === this.category)
            : this.products;
      });
  }

  ngOnInit(): void {
  }

}
