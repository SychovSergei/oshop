import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoryList, CategoryService} from "../../../shared/services/category.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ProductService} from "../../../shared/services/product.service";
import {Product, ProductImage} from 'src/app/shared/models/product';
import {ActivatedRoute, Router} from "@angular/router";
import {BehaviorSubject, Observable, Subscription, take} from "rxjs";
import {ValidateStartsEndsWhiteSpace} from "./whitespace.validator";

import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

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
  oldValueImages: ProductImage[];
  isFormChanged: boolean = false;
  urlRegEx = 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)';
  form: FormGroup;

  images: BehaviorSubject<ProductImage[]> = new BehaviorSubject<ProductImage[]>([]);
  images$: Observable<ProductImage[]> = this.images.asObservable();

  filesForLoading: File[];
  filesForBackup: File[];
  percentageChanges$: Observable<number|undefined>[];

  subGetProduct: Subscription;
  subFormValueChanges: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.categories$ = this.categoryService.getAll();

    this.form = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        ValidateStartsEndsWhiteSpace
      ]),
      isActive: new FormControl(false, []),
      price: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.pattern("^\\d*\\.?(?:\\d{1,2})?$")
      ]),
      category: new FormControl('', [
        Validators.required
      ]),
      images: new FormControl([], [])
    });

    if (this.id) {
      this.subGetProduct = this.productService.get(this.id)
        .pipe(take(1))
        .subscribe(prod => {
          this.product = prod;
          this.oldValue = prod;
          this.oldValueImages = [...prod.images];
          this.form.get('title')?.patchValue(prod.title);
          this.form.get('isActive')?.patchValue(prod.isActive);
          this.form.get('price')?.patchValue(prod.price ? prod.price : '0');
          this.form.get('category')?.patchValue(prod.category);

          this.images.next(prod.images || []);
          this.images$.subscribe((array) => {
            this.form.get('images')?.patchValue(array);
            this.product.images = array;
            this.isFormChanged = !this.isEqualNameItemArrays(this.oldValueImages, this.form.get('images')?.value);
          })
        });
    }

    this.subFormValueChanges = this.form.valueChanges.subscribe((val: Product) => {
      this.product = val;
      if (this.id) {
        this.isFormChanged =
          this.oldValue.title !== val.title
          || this.oldValue.isActive !== val.isActive
          || this.oldValue.price !== val.price
          || this.oldValue.category !== val.category
          || !this.isEqualNameItemArrays(this.oldValueImages, val.images)
      }
    })
  }

  saveOrUpdate(product: Product) {
    if (this.id) this.productService.update(this.id, product)
      .then(() => {
        this.isFormChanged = false;
        // this.router.navigate(['/admin/products'])
      })
    this.oldValueImages = this.form.get('images')?.value;
  }

  delete() {
    if (!confirm('Are you sure to delete this product?')) return;

    this.productService.delete(this.id!);
    this.router.navigate(['/admin/products']);
  }

  deleteImage(imageName: string) {
    const temp = this.images.value.filter((item) => {
      return item.fileName !== imageName;
    })
    this.images.next(temp);
    this.form.get('images')?.patchValue(temp);
  }

  getFilesFromDrop(files: File[]) {
    this.filesForLoading = files;
  }

  backupFilesFromDrop(files: File[]) {
    this.filesForBackup = files;
    const newArr: File[] = this.filesForBackup.filter((file) =>
      !(this.form.get('images')?.value).find((image: ProductImage) =>
        image.fileName === file.name)
    )
    const namesBackup: string[] = [];
    newArr.forEach(file => namesBackup.push(file.name));
    const backupImages = this.oldValueImages.filter((image) => namesBackup.find((name) => image.fileName === name));
    this.images.next([ ...(this.form.get('images')?.value),...backupImages]);

  }

  addImage(newImage: ProductImage) {
    this.images$
      .pipe(take(1))
      .subscribe((val) => {
        const oldLength = val.length;
        const concatResult = this.concatUniqValuesByField(val, [newImage], 'fileName');
        this.images.next(concatResult);
        this.form.get('images')?.patchValue(concatResult);
      })
  }

  private concatUniqValuesByField(arr1: ProductImage[], arr2: ProductImage[], fieldName: string) {
    const field = fieldName as keyof ProductImage;
    const res = arr2.filter((arr2item) => !arr1.find(arr1item => arr2item[field] === arr1item[field] ));
    return [...arr1, ...res];
  }

  drop(event: CdkDragDrop<ProductImage[]>) {
    moveItemInArray(this.product.images, event.previousIndex, event.currentIndex);
    this.isFormChanged = !this.isEqualNameItemArrays(this.oldValueImages, this.form.get('images')?.value);
  }

  ngOnDestroy(): void {
    if (this.subGetProduct) {
      this.subGetProduct.unsubscribe();
      }
    this.subFormValueChanges.unsubscribe()
  }

  private isEqualNameItemArrays(arr1: ProductImage[], arr2: ProductImage[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    } else {
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i].fileName !== arr2[i].fileName) {
          return false;
        }
      }
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i].url !== arr2[i].url) {
          return false;
        }
      }
    }
    return true;
  }

}

