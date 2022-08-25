import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductService} from "../../product.service";
import {Product} from "../../models/product";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  products: Product[];
  filteredProducts: Product[];
  searchValue: string;
  subProducts: Subscription;

  constructor(private productService: ProductService) {
    this.subProducts = this.productService.getAll()
      .subscribe(products => this.filteredProducts = this.products = products);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subProducts.unsubscribe();
  }

  filter(event: KeyboardEvent) {
    this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredProducts = (this.searchValue)
      ? this.products.filter(prod => prod.title.toLowerCase().includes(this.searchValue))
      : this.products;
  }

}
