import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoryList, CategoryService} from "../../category.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ProductService} from "../../product.service";
import { Product } from 'src/app/models/product';
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, take} from "rxjs";

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  categories$: Observable<any>;
  id: string | null;
  product: Product;
  urlRegEx = 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)';
  form:FormGroup;
  disabl$: Observable<any>

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {
    this.categories$ = this.categoryService.getCategories();

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.productService.get(this.id)
        .pipe(take(1))
        .subscribe(prod => {
          this.product = prod;
          this.form.controls['title'].setValue(this.product.title, {onlySelf: true});
          this.form.controls['price'].setValue(this.product.price, {onlySelf: true});
          this.form.controls['category'].setValue(this.product.category, {onlySelf: true});
          this.form.controls['imageUrl'].setValue(this.product.imageUrl, {onlySelf: true});
        })
    }
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(2)
      ]),
      price: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.pattern("^\\d*\\.?(?:\\d{1,2})?$")
      ]),
      category: new FormControl('', [
        Validators.required
      ]),
      imageUrl: new FormControl('', [
        Validators.required,
        Validators.pattern(this.urlRegEx)
      ])
    })
  }

  save(product: Product) {
    if (this.id) this.productService.update(this.id, product)
      .then(() => this.router.navigate(['/admin/products']))
    else this.productService.create(product)
      .then(() => this.router.navigate(['/admin/products']))
  }

  delete() {
    if (!confirm('Are you sure to delete this product?')) return;

    this.productService.delete(this.id!);
    this.router.navigate(['/admin/products']);
  }
}
