import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireObject} from "@angular/fire/compat/database";
import firebase from "firebase/compat/app";
import {AppUser} from "./models/app-user";
import {from, map, Observable, of, switchMap} from "rxjs";

@Injectable()
export class UserService {

  constructor(private db: AngularFireDatabase) {}

  save(user: firebase.User) {
    this.db.object('/users/' + user.uid).update({
      name: user.displayName,
      email: user.email
    })
  }

  get(uid: string): Observable<AppUser | null> {
    return this.db.object<AppUser>('/users/' + uid).valueChanges();
  }
}
