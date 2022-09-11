import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {Product} from "../models/product";
import {map, Observable, switchMap} from "rxjs";

@Injectable()
export class ProductService {

  constructor(private db: AngularFireDatabase) { }

  create(product: Product) {
    return this.db.list('/products').push(product);
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

  update(productId: string, product: Product) {
    return this.db.object('/products/' + productId).update(product);
  }

  delete(productId: string) {
    return this.db.object('/products/' + productId).remove();
  }
}
