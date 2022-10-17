import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {of, Observable, switchMap} from "rxjs";
import firebase from "firebase/compat/app";
import {ActivatedRoute} from "@angular/router";
import {AppUser} from "../models/app-user";
import {UserService} from "./user.service";

@Injectable()
export class AuthService {
  user$: Observable<firebase.User | null>;

  constructor(
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private userService: UserService
  ) {
    this.user$ = afAuth.authState;
  }

  loginWithGoogle() {
    return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logOut() {
    return this.afAuth.signOut();
  }

  get appUser$(): Observable<AppUser | null> {
    return this.user$
      .pipe(
        switchMap(user => {
          if (user) return this.userService.get(user?.uid!);
          return of(null);
        })
      )
  }
}
