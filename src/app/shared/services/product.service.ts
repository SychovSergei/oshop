import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {Product, ProductImage} from "../models/product";
import {map, Observable, take} from "rxjs";

@Injectable()
export class ProductService {

  constructor(private db: AngularFireDatabase) { }

  createEmptyProduct(category: string) {
    return this.db.list('/products').push({
      dateCreated: new Date().getTime(),
      available: false,
      title: 'New',
      price: 0,
      quantity: 0,
      description: 'New',
      category: category,
      images: []
    } as Product);
  }

  create(product: Product) {
    return this.db.list('/products').push(product);
  }

  update(productId: string, product: Product) {
    return this.db.object('/products/' + productId).update(product);
  }

  delete(productId: string) {
    return this.db.object('/products/' + productId).remove();
  }

  getAll(): Observable<Product[]> {
    return this.db.list<Product[] | null>('/products')
      .snapshotChanges()
      .pipe(
        map(changes => changes
          .map(c => ({ key: c.key, ...c.payload.toJSON() } as Product))
        )
      );
  }


  get(productId: string): Observable<Product> {
    return this.db.object<Product>('/products/' + productId)
      .valueChanges()
      .pipe(
        map(response => ({ key: productId, ...response} as Product))
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
