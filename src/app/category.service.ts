import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {map} from "rxjs";

export interface CategoryList {
  key?: string;
  name: string;
}

@Injectable()
export class CategoryService {

  constructor(private db: AngularFireDatabase) { }

  getAll() {
    return this.db.list<CategoryList>(
      '/categories',
        category => category.orderByChild('name')
    ).snapshotChanges()
      .pipe(
        map(changes => changes
          .map(c => ({ key: c.payload.key, ...c.payload.val() } as CategoryList)))
      );
  }
}
