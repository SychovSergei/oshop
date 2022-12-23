import { AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, OnDestroy, OnInit, ViewChild, ViewContainerRef}  from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ProductService} from "../../../shared/services/product.service";
import {ProductTypeUnion, ProductImage, ContentType, Product} from 'src/app/shared/models/product';
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, Subscription, take, switchMap, of, forkJoin, map, mergeMap, catchError} from "rxjs";

import {NotebookDetailComponent} from "./notebook-detail/notebook-detail.component";
import {ComputerDetailComponent} from "./computer-detail/computer-detail.component";
import {AuthService} from "../../../shared/services/auth.service";
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {RoutingStateService} from "../../../shared/services/routing-state.service";
import {StorageImagesService} from "../../../shared/services/storage-images.service";
import {BreakpointObserver} from "@angular/cdk/layout";


@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit, AfterViewInit, OnDestroy {
  id: string; // get id from url for edit product mode
  newId: string; //generate newId for create new product mode
  product: ProductTypeUnion;// for product preview
  // for checking changes in the form
  private oldValue: ProductTypeUnion;
  private oldValueImages: ProductImage[] = [];
  isFormChanged: boolean = false;
  form: FormGroup;
  private formDataFromLocal: Product<any> | null = null;
  // if product does not exist show message to user
  isProductExists: boolean = true;

  // images - show available images to the user
  images: ProductImage[] = [];
  // imagesForDeleteArr - images for deleting when user saves or updates product
  imagesForDeleteArr: ProductImage[] = [];

  filesForLoading: File[] = [];
  public isCreateNewMode: boolean;
  public iterableContentTypes: ContentType[] = [];

  // Subscriptions
  private subGetProduct: Subscription;
  private subFormValueChanges: Subscription;
  private subImgStgServ: Subscription;
  private subNavigateStart: Subscription;
  private subMediaRespMedium: Subscription;
  private subDeleteImgFromDb: Subscription;
  private subLoadDataFromServer: Subscription;

  // response
  isMedium: boolean;

  // expansion panel open/close
  panelOpenState: boolean = false;

  constructor(
    private authService: AuthService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,

    private db: AngularFireDatabase,
    private imageStorageService: StorageImagesService,
    private routerState: RoutingStateService,
    private responsive: BreakpointObserver
  ) {}

  @ViewChild('itemDetail', { read: ViewContainerRef })//, static: true
  itemDetailContainerRef: ViewContainerRef;

  private componentRef2: ComponentRef<NotebookDetailComponent>;

  private detailContentStyles: any = {
    notebooks: { label: 'Notebook', component: NotebookDetailComponent },
    computers: { label: 'Computer', component: ComputerDetailComponent }
  };


  ngOnInit(): void {
    /** Convert data for Category selector.
     *  Put data into Input Selector component. */
    this.makeItemOptionIterable();

    this.subMediaRespMedium = this.responsive.observe(['(min-width: 768px)'])
      .subscribe((res) => {
        this.isMedium = res.matches;
      });

    this.isCreateNewMode = this.route.snapshot.data['createNew'];

    if (!this.isCreateNewMode) this.id = this.route.snapshot.paramMap.get('id')!;

    /** If the page was reloaded then load data from localtorage.
     *  If the page url has changed then remove the id and data from the form. */
    if (this.routerState.getHistory().length > 1) {
      if (this.routerState.getPreviousUrl() !== this.routerState.getCurrentUrl()) {
        sessionStorage.removeItem('productFormData');
        sessionStorage.removeItem('imagesForDelete');
        sessionStorage.removeItem('newProdId');
      }
    }

    /** Create new id or get id from local.
     *  If the form is being used in create mode, then a new product
     *  key must be generated. The new key is used to upload pictures
     *  before the product creation process.*/
    if (this.isCreateNewMode) {
      if (!sessionStorage.getItem('newProdId')!) {
        this.newId = this.db.createPushId();
        sessionStorage.removeItem('productFormData');
        sessionStorage.removeItem('imagesForDelete');
        sessionStorage.setItem('newProdId', this.newId);
      } else {
        this.newId = sessionStorage.getItem('newProdId')!;
      }
    }

    if (sessionStorage.getItem('productFormData')!) {
      this.formDataFromLocal = JSON.parse(sessionStorage.getItem('productFormData')!);
    }

    /** If the page is reloaded in the same url, the data will be restored from local. */
    this.form = new FormGroup({
      available: new FormControl(
        this.formDataFromLocal?.available ? this.formDataFromLocal?.available : false,
        [
          Validators.required]),
      title: new FormControl(
        this.formDataFromLocal?.title ? this.formDataFromLocal?.title : '',
        [
          Validators.required,
          Validators.minLength(3)]),
      price: new FormControl(
        this.formDataFromLocal?.price ? this.formDataFromLocal?.price : 0,
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern('^\\$?([1-9]{1}[0-9]{0,2}(\\,[0-9]{3})*(\\.[0-9]{0,2})?|[1-9]{1}[0-9]{0,}(\\.[0-9]{0,2})?|0(\\.[0-9]{0,2})?|(\\.[0-9]{1,2})?)$')]),
      quantity: new FormControl(
        this.formDataFromLocal?.quantity ? this.formDataFromLocal?.quantity : 0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(99999),
          Validators.pattern('^(0|[1-9][0-9]{0,4}?)$')]),
      description: new FormControl(
        this.formDataFromLocal?.description ? this.formDataFromLocal?.description : '',
        []),
      discount: new FormControl(
        // 0,
        this.formDataFromLocal?.discount ? this.formDataFromLocal?.discount : 0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(100),
          Validators.pattern('^\\$?([1-9]{1}[0-9]{0,2}(\\,[0-9]{3})*(\\.[0-9]{0,2})?|[1-9]{1}[0-9]{0,}(\\.[0-9]{0,2})?|0(\\.[0-9]{0,2})?|(\\.[0-9]{1,2})?)$')]),
      category: new FormControl(
        this.formDataFromLocal?.category ? this.formDataFromLocal?.category : null, //'notebooks',//
        [
          Validators.required])
    });

    this.form.addControl("images", new FormControl([]));

    if (sessionStorage.getItem('imagesForDelete'))
      this.imagesForDeleteArr = JSON.parse(sessionStorage.getItem('imagesForDelete')!);

    /** Loading images from DB - ngOnInit() */
    this.subImgStgServ = this.imageStorageService.getAllById(this.newId ? this.newId : this.id)
      .subscribe((imgRes) => {

        this.images = imgRes ? imgRes : [];
        /** Create del names list from local */
        const forDelNamesArr: string[] = [];
        this.imagesForDeleteArr.forEach((item) => {
          forDelNamesArr.push(item.fileName);
        });

        this.images.forEach((img) => {
          this.images = this.images.filter((item) => !forDelNamesArr.includes(item.fileName))
        })

        this.form.get('images')?.setValue(imgRes);
        sessionStorage.setItem('productFormData', JSON.stringify(this.form.value));
      })

    /** Save form data to sessionStorage with delay.
     *  If the page is reloaded then the data can be restored from sessionStorage  */
    this.subFormValueChanges = this.form.valueChanges
      .subscribe((result) => {
        this.isFormChanged = this.checkFormValueChanges(result);
        sessionStorage.setItem('productFormData', JSON.stringify(result))
    })

  }

  ngAfterViewInit() {
    let formData: ProductTypeUnion = this.form.value;
    /** If CREATE mode */
    // if (!this.id) {
      /** Create Detail Form Component by category / if category selected */
      // this.changeValue()
      // this.instantiateDetailForm(formData.category);//???
    // }

    /** If EDIT mode */
    // else {
    if (this.id) {
      this.subLoadDataFromServer = this.loadDataFromServer(this.id)
        .subscribe((prod: ProductTypeUnion | null) => {
          if (!prod) {
            this.isProductExists = false;
          } else {
            this.updateDataFromServerWith(prod);
            formData = prod;
            /** Create Detail Form Component by category */
            this.instantiateDetailForm(formData.category);
            this.rebuildDetailSubFormAndPopulateWith(formData);
          }
        })
    }
  }

  ngOnDestroy(): void {
    if (this.subGetProduct)
      this.subGetProduct.unsubscribe();
    if (this.subFormValueChanges)
      this.subFormValueChanges.unsubscribe()
    if (this.subNavigateStart)
      this.subNavigateStart.unsubscribe();
    if (this.subImgStgServ)
      this.subImgStgServ.unsubscribe();
    if (this.subMediaRespMedium)
      this.subMediaRespMedium.unsubscribe();
    if (this.subDeleteImgFromDb)
      this.subDeleteImgFromDb.unsubscribe();
    if (this.subLoadDataFromServer)
      this.subLoadDataFromServer.unsubscribe();
  }




  saveOrUpdateProduct(product: ProductTypeUnion) {
    /** Product CREATE MODE */
    if (this.isCreateNewMode) {
      product.dateCreated = new Date().getTime();
      product.dateModify = product.dateCreated;

      this.subDeleteImgFromDb = this.deleteImagesFromDbStore()
        .pipe(
          map((rr) => {
            this.clearSessionStorage();
            this.imagesForDeleteArr = [];
            return rr
          }),
          switchMap((res) => {
            return this.authService.user$
              .pipe(
                take(1),
                mergeMap((user) => {
                  product.creatorId = user?.uid!;
                  return forkJoin([this.productService.createProdById(product, this.newId)])
                    .pipe(
                      map((dd) => {
                        return true
                      }),
                      catchError(error => of(`Error: ${error}`))
                    )
                }),
              )
          })
      )
      .subscribe((user) => {
          this.isFormChanged = false;
          this.router.navigate(['/admin/products/' + this.newId]);
      })
    }
    /** Product UPDATE MODE */
    else {
      product.dateModify = new Date().getTime();
      if(this.id) this.productService.update(this.id, product)
        .then(() => {
          this.deleteImagesFromDbStore();
          this.clearSessionStorage();

          this.isFormChanged = false;
          this.loadDataFromServer(this.id!)
            .subscribe((val) => {
              if (val === null) {
                this.isProductExists = false;
              } else {
                this.updateDataFromServerWith(val);
                this.imagesForDeleteArr = [];
              }
            })
        })
        .catch((error) => {
          console.log(error)
        });
    }

    this.oldValueImages = this.form.get('images')?.value;
    /** After Save or update product delete data from browser storage*/
    sessionStorage.removeItem('productFormData');
    sessionStorage.removeItem('newProdId');
  }

  delete() {
    if (!confirm('Are you sure to delete this product?')) return;

    this.productService.delete(this.id!)
      .then(() => { this.router.navigate(['/admin/products']); });
  }

  private loadDataFromServer(id: string): Observable<ProductTypeUnion | null> {
    return this.productService.get(id);
  }

  private clearSessionStorage() {
    sessionStorage.removeItem('newProdId');
    sessionStorage.removeItem('imagesForDelete');
    sessionStorage.removeItem('productFormData');
  }

  private deleteImagesFromDbStore() {
    const arr: string[] = [];
    this.imagesForDeleteArr.forEach((img) => {
      arr.push(img.fileName);
      this.imageStorageService.deleteImageByUrl(img.url);
    })
    return of(arr);
  }

  /** Change Category on form by click on select component */
  changeValue() {
    this.itemDetailContainerRef.clear();
    this.instantiateDetailForm(this.form.value.category);
  }

  drop(event: CdkDragDrop<ProductImage[]>) {
    moveItemInArray(this.product.images, event.previousIndex, event.currentIndex);
    this.images = this.form.value['images'];
    this.product = {...this.form.value};
    this.isFormChanged = !this.isEqualNameItemArrays(this.oldValueImages, this.form.get('images')?.value);
  }

  private updateDataFromServerWith(prod: ProductTypeUnion) {//id: string
    this.product = prod;
    this.oldValue = prod;
    this.oldValueImages = prod.images ? [...prod.images] : [];

    this.images = prod.images || [];
  }


  /** CREATE DETAIL SUBFORM - START */

  private instantiateDetailForm(category: string) {
    if (category) {
      const childComponentRef = this.detailContentStyles[category].component;
      this.itemDetailContainerRef.clear();
      this.componentRef2 = this.itemDetailContainerRef.createComponent(childComponentRef);
    }
  }

  /** When the product category changes, then the old form with
   *  product details is replaced with the new one. */
  private rebuildDetailSubFormAndPopulateWith(formData: ProductTypeUnion): void {
    if (formData.category) {
      const childForm = this.componentRef2.instance.childForm;
      this.form.removeControl('details');
      this.form.addControl('details', childForm as FormGroup);
      this.form.patchValue(formData);
    }
    else this.form.removeControl('details');
  }

  /** CREATE DETAIL SUBFORM - END */

  private checkFormValueChanges(val: ProductTypeUnion): boolean {
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
        return arr.some(value => value);
      } else {
        return true;
      }
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


  /** Change format for Category selector */
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

  /** ADD IMAGES FROM UPLOAD TASK  - START */

  /** Get files from outside - child component */
  getFilesFromDrop(files: File[]) {
    this.filesForLoading = files;
  }

  /** Execute when file load to db => file add to images in view */
  addImage(newImage: ProductImage) {
    this.images.push(newImage);
    this.form.get('images')?.setValue(this.images);
    sessionStorage.setItem('productFormData', this.form.value);
  }
  /** ADD IMAGES FROM UPLOAD TASK  - END */

  /** DELETE/RESTORE IMAGES BLOCK - START */

  /** Check file is deleted. For change style of component. */
  checkIsDeleted(img: ProductImage): boolean {
    return this.createArrayOfDelNamesFromArray(this.imagesForDeleteArr)
      .includes(img.fileName);
  }

  private createArrayOfDelNamesFromArray(initArr: ProductImage[]) {
    const tempArr: string[] = [];
    initArr.forEach((item) => {
      tempArr.push(item.fileName);
    });
    return tempArr;
  }

  /** Filter images for view and add image in array which
   *  will be deleted on save event */
  deleteImageFromViewList(image: ProductImage) {
    this.images = this.filterImagesByName(this.images, image);
    this.addImagesToDeleteList(image);
    this.form.get('images')?.setValue(this.images);
    sessionStorage.setItem('imagesForDelete',JSON.stringify(this.imagesForDeleteArr));
  }

  restoreImageToViewList(image: ProductImage) {
    this.removeImagesFromDeleteList(image);
    this.images.push(image);
    this.form.get('images')?.setValue(this.images);
    sessionStorage.setItem('imagesForDelete',JSON.stringify(this.imagesForDeleteArr));
  }

  private filterImagesByName(images: ProductImage[], image: ProductImage) {
    return images.filter((item) => item.fileName !== image.fileName);
  }

  /** Add image to list for deleting*/
  private addImagesToDeleteList(image: ProductImage) {
    const imgForDeleteArr = this.imagesForDeleteArr;
    const tempArr: string[] = [];
    imgForDeleteArr.forEach((item) => {
      tempArr.push(item.fileName);
    });
    if (!tempArr.includes(image.fileName))
      imgForDeleteArr.push(image);

    this.imagesForDeleteArr = imgForDeleteArr;
  }
  /** Add image to list for deleting*/
  private removeImagesFromDeleteList(image: ProductImage) {
    const imgForDeleteArr = this.imagesForDeleteArr;
    if (this.createArrayOfDelNamesFromArray(imgForDeleteArr).includes(image.fileName))
      this.imagesForDeleteArr = imgForDeleteArr.filter((item) => {
        return item.fileName !== image.fileName;
      });
  }
  /** DELETE/RESTORE IMAGES BLOCK - END */
}

