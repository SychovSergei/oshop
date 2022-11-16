import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ProductService} from "../../../shared/services/product.service";
import {ProductTypeUnion, ProductImage, ContentType} from 'src/app/shared/models/product';
import {ActivatedRoute, Router} from "@angular/router";
import {BehaviorSubject, Observable, Subscription, take} from "rxjs";

import {NotebookDetailComponent} from "./notebook-detail/notebook-detail.component";
import {ComputerDetailComponent} from "./computer-detail/computer-detail.component";
import {AuthService} from "../../../shared/services/auth.service";
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit, OnDestroy {
  id: string | null;
  product: ProductTypeUnion;
  private oldValue: ProductTypeUnion;
  oldValueImages: ProductImage[];
  isFormChanged: boolean = false;
  form: FormGroup;

  images: BehaviorSubject<ProductImage[]> = new BehaviorSubject<ProductImage[]>([]);
  images$: Observable<ProductImage[]> = this.images.asObservable();

  filesForLoading: File[];
  filesForBackup: File[];
  percentageChanges$: Observable<number|undefined>[];

  subGetProduct: Subscription;
  subFormValueChanges: Subscription;

  panelOpenState: boolean = false;

  constructor(
    private authService: AuthService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
  ) {}

  @ViewChild('itemDetail', { read: ViewContainerRef, static: true })
  itemDetailContainer: ViewContainerRef;

  private detailContentStyles: any = {
    notebooks: { label: 'Notebook', component: NotebookDetailComponent },
    computers: { label: 'Computer', component: ComputerDetailComponent }
  };

  private childComponent: any;

  public createNewProductItem: boolean;
  public iterableContentTypes: ContentType[] = [];

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.createNewProductItem = this.route.snapshot.data['createNew'];
    this.makeItemOptionIterable();
    this.form = new FormGroup({
      available: new FormControl(false, [
        Validators.required
      ]),
      title: new FormControl('Name', [
        Validators.required, Validators.minLength(3)
      ]),
      price: new FormControl(150, [
        Validators.required,
        Validators.min(0),
        Validators.pattern('^\\$?([1-9]{1}[0-9]{0,2}(\\,[0-9]{3})*(\\.[0-9]{0,2})?|[1-9]{1}[0-9]{0,}(\\.[0-9]{0,2})?|0(\\.[0-9]{0,2})?|(\\.[0-9]{1,2})?)$')
      ]),
      quantity: new FormControl(0, [
        Validators.required,
        Validators.min(0),
        Validators.max(99999),
        Validators.pattern('^(0|[1-9][0-9]{0,4}?)$')
      ]),
      description: new FormControl('Descr', []),
      discount: new FormControl(0, [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('^\\$?([1-9]{1}[0-9]{0,2}(\\,[0-9]{3})*(\\.[0-9]{0,2})?|[1-9]{1}[0-9]{0,}(\\.[0-9]{0,2})?|0(\\.[0-9]{0,2})?|(\\.[0-9]{1,2})?)$')
      ]),
      category: new FormControl( null, [
        Validators.required
      ])
    });

    this.form.addControl("images", new FormControl([]));
    let formData: ProductTypeUnion = this.form.value;

    if (this.id) {
      this.loadDataFromServer(this.id)
        .subscribe((prod: ProductTypeUnion) => {
          this.updateDataFromServerWith(prod);
          formData = prod;
          this.instantiateDetailForm(formData);
        })
    }
    else {
      // formData.category = this.iterableContentTypes[0].id;
      this.instantiateDetailForm(formData);
    }

    this.checkFormValueChanges();
  }

  ngOnDestroy(): void {
    if (this.subGetProduct) {
      this.subGetProduct.unsubscribe();
    }
    this.subFormValueChanges.unsubscribe()
  }

  private loadDataFromServer(id: string): Observable<ProductTypeUnion> {
    return this.productService.get(id)
      .pipe(take(1))
  }

  saveOrUpdateProduct(product: ProductTypeUnion) {
    // Product CREATE
    if (this.createNewProductItem) {
      product.dateCreated = new Date().getTime();
      product.dateModify = product.dateCreated;
      this.authService.user$
        .pipe(take(1))
        .subscribe((user) => {
          product.creatorId = user?.uid!;
          this.productService.create(product)
            .then((res) => {
              this.isFormChanged = false;
              this.router.navigate(['/admin/products', res.key]);
            })
            .catch(err => { console.log(err) })
        })
    }
    // Product UPDATE
    else {
      product.dateModify = new Date().getTime();
      if(this.id) this.productService.update(this.id, product)
        .then(() => {
          console.log('update success')
          this.isFormChanged = false;
          this.loadDataFromServer(this.id!)
            .subscribe((val) => {
              this.updateDataFromServerWith(val);
            })
        })
        .catch((error) => {
          console.log(error)
        });
    }

    this.oldValueImages = this.form.get('images')?.value;
  }

  delete() {
    if (!confirm('Are you sure to delete this product?')) return;

    this.productService.delete(this.id!)
      .then(() => { this.router.navigate(['/admin/products']); });
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
        const concatResult = this.concatUniqValuesByField(val, [newImage], 'fileName');
        this.images.next(concatResult);
        this.form.get('images')?.patchValue(concatResult);
      })
  }

  changeValue() {
    this.itemDetailContainer.clear();
    this.instantiateDetailForm(this.form.value);
  }

  drop(event: CdkDragDrop<ProductImage[]>) {
    moveItemInArray(this.product.images, event.previousIndex, event.currentIndex);
    this.images.next(this.form.value['images']);
    this.isFormChanged = !this.isEqualNameItemArrays(this.oldValueImages, this.form.get('images')?.value);
  }

  private updateDataFromServerWith(prod: ProductTypeUnion) {//id: string
    this.product = prod;
    this.oldValue = prod;
    this.oldValueImages = prod.images ? [...prod.images] : [];

    this.images.next(prod.images || []);
    this.images$.subscribe((array) => {
      this.form.get('images')?.patchValue(array);
      this.product.images = array;
      this.isFormChanged = !this.isEqualNameItemArrays(this.oldValueImages, this.form.get('images')?.value);
    })
  }

  private instantiateDetailForm(formData: ProductTypeUnion) {
    if (formData.category) {
      const childComponentRef = this.detailContentStyles[formData.category].component;
      const factoryInstance = this.componentFactoryResolver.resolveComponentFactory(childComponentRef);
      this.childComponent = this.itemDetailContainer.createComponent(factoryInstance);
    }

    this.rebuildFormAndPopulateWith(formData);
  }


  private rebuildFormAndPopulateWith(formData: ProductTypeUnion): void {
    if (formData.category) {
      const childForm = this.childComponent.instance.childForm;
      this.form.removeControl('details');
      this.form.addControl('details', childForm as FormGroup);
      this.form.patchValue(formData);
    }
    else this.form.removeControl('details');
  }


  private checkFormValueChanges() {
    this.subFormValueChanges = this.form.valueChanges.subscribe((val: ProductTypeUnion) => {
      this.product = val;
      if (this.id) {
        const arr: boolean[] = [];
        for (const key in this.form.value) {
          if (key === 'images') {
            arr.push(!this.isEqualNameItemArrays(this.oldValueImages, val.images))
          }
          else if (key === 'details') {
            for (const detKey in this.oldValue[key]) {
              arr.push(
                this.oldValue[key][detKey as keyof ProductTypeUnion['details']] !==
                this.form.value[key][detKey as keyof ProductTypeUnion['details']]
              );
            }
          } else {
            arr.push(this.oldValue[key as keyof ProductTypeUnion] !== val[key as keyof ProductTypeUnion])
          }
        }
        this.isFormChanged = arr.some(value => value);
      } else {
        this.isFormChanged = true;
      }
    })
  }

  private concatUniqValuesByField(arr1: ProductImage[], arr2: ProductImage[], fieldName: string) {
    const field = fieldName as keyof ProductImage;
    const res = arr2.filter((arr2item) => !arr1.find(arr1item => arr2item[field] === arr1item[field] ));
    return [...arr1, ...res];
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

  private makeItemOptionIterable() {
    for (const option in this.detailContentStyles) {
      if (this.detailContentStyles.hasOwnProperty(option)) {
        this.iterableContentTypes.push({
          id: option,
          label: this.detailContentStyles[option].label
        });
      }
    }
  }
}

