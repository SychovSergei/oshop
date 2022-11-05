import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import firebase from "firebase/compat/app";
import {AppUser} from "../models/app-user";
import {Observable, take, tap} from "rxjs";

@Injectable()
export class UserService {

  constructor(private db: AngularFireDatabase) {}

  save(userCred: firebase.auth.UserCredential) {
    const providerData = userCred.user?.providerData.find((itemProvider) => {
      return itemProvider!.providerId === userCred.additionalUserInfo?.providerId;
    });
    const userObj: AppUser = {
      email: providerData!.email!,
      isAdmin: false
    };

    this.get(userCred.user?.uid!)
      .pipe(
        take(1),
        tap((appUser) => {
          userObj.isAdmin = appUser?.isAdmin ? appUser?.isAdmin : false;
        })
      )
      .subscribe({
        next: () => {
          this.db.object<AppUser>('/users/' + userCred.user?.uid)
            .update(userObj);
      },
        error: (err) => { throw err; }
      })
  }

  get(uid: string): Observable<AppUser | null> {
    return this.db.object<AppUser>('/users/' + uid).valueChanges();
  }
}
