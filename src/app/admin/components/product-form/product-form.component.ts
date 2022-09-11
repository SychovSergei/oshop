import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoryList, CategoryService} from "../../../shared/services/category.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ProductService} from "../../../shared/services/product.service";
import { Product } from 'src/app/shared/models/product';
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, Subscription, take} from "rxjs";
import {ValidateStartsEndsWhiteSpace} from "./whitespace.validator";

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnDestroy {
  categories$: Observable<CategoryList[]>;
  id: string | null;
  product: Product;
  oldValue: Product;
  isFormChanged: boolean = false;
  urlRegEx = 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)';
  form:FormGroup;
  subGetProduct: Subscription;
  subFormValueChanges: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        ValidateStartsEndsWhiteSpace
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
    });

    this.categories$ = this.categoryService.getAll();
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.subGetProduct = this.productService.get(this.id)
        .pipe(take(1))
        .subscribe(prod => {
          this.product = prod;
          this.oldValue = prod;
          this.form.controls['title'].setValue(prod.title, {onlySelf: true});
          this.form.controls['price'].setValue(prod.price, {onlySelf: true});
          this.form.controls['category'].setValue(prod.category, {onlySelf: true});
          this.form.controls['imageUrl'].setValue(prod.imageUrl, {onlySelf: true});
        });
    }
    this.isFormChanged = true;
    this.subFormValueChanges = this.form.valueChanges.subscribe((val: Product) => {
      this.product = val;
      if (this.id) {
        this.isFormChanged =
          this.oldValue.title !== val.title
          || this.oldValue.price !== val.price
          || this.oldValue.category !== val.category
          || this.oldValue.imageUrl !== val.imageUrl;
      }
    })
  }

  ngOnDestroy(): void {
        this.subGetProduct.unsubscribe();
        this.subFormValueChanges.unsubscribe()
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
