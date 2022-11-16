import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {ProductImage, ProductTypeUnion} from "../models/product";
import {map, Observable, take} from "rxjs";
import {NotifierService} from "angular-notifier";

@Injectable()
export class ProductService {
  private readonly notifier: NotifierService;

  constructor(
    private db: AngularFireDatabase,
    private notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

  create(product: ProductTypeUnion) {
    return this.db.list('/products').push(product)
      .then((res) => {
        this.notifier.notify('success', 'The product has been created.');
        return res;
      });
  }

  update(productId: string, product: ProductTypeUnion) {
    console.log(product.category)
    return this.db.object('/products/' + productId).update(product)
      .then(() => {
        this.notifier.notify('success', 'The product has been updated.');
      });
  }

  delete(productId: string) {
    return this.db.object('/products/' + productId).remove()
      .then(() => {
        this.notifier.notify('success', 'The product has been deleted.');
      });
  }

  getAll(): Observable<ProductTypeUnion[]> {
    return this.db.list<ProductTypeUnion[] | null>(`/products/`)
      .snapshotChanges()
      .pipe(
        map(changes => changes
          .map(c => ({ key: c.key, ...c.payload.toJSON() } as ProductTypeUnion))
        )
      );
  }


  get(productId: string): Observable<ProductTypeUnion> {
    return this.db.object<ProductTypeUnion>('/products/' + productId)
      .valueChanges()
      .pipe(
        map(response => ({ key: productId, ...response} as ProductTypeUnion))
      );
  }

  getProductImages(productId: string): Observable<ProductImage[]> {
    return this.db.list<ProductImage>('/products/' + productId + '/images')
      .snapshotChanges()
      .pipe(
        map(changes => changes
          .map(c => ({ key: c.key, ...c.payload.toJSON() } as ProductImage))
        )
      );
  }

  deleteImageItem(productId: string, imageKey: string) {
    let imageItem = this.db.object<ProductImage>('/products/' + productId+ '/images/'+ imageKey); //

    imageItem.snapshotChanges()
      .pipe(take(1))
      .subscribe( item => {
        imageItem.remove();
      })
  }
}
