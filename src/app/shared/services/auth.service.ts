import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Observable} from "rxjs";
import firebase from "firebase/compat/app";
import {FirebaseError} from "firebase-admin";
import {NotifierService} from "angular-notifier";
import {RegisterUser} from "../models/register-user";
import OAuthCredential = firebase.auth.OAuthCredential;

@Injectable()
export class AuthService {
  user$: Observable<firebase.User | null>;
  private readonly notifier: NotifierService;

  constructor(
    private afAuth: AngularFireAuth,
    private notifierService: NotifierService
  ) {
    this.user$ = afAuth.authState;
    this.notifier = notifierService;
  }

  loginWithEmailAndPassword(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((res) => {
        this.notifier.notify('success', 'Login success! Welcome, ' + res.user?.displayName + '!');
        return res;
      })
      .catch((err: FirebaseError) => {
        if (err.code === 'auth/account-exists-with-different-credential') {
          this.afAuth.fetchSignInMethodsForEmail(email)
            .then(methods => {
              this.notifier.notify('warning', 'Please choose a more secure login option: '
                + this.getPreferMethods(methods)
              );
              throw err;
            })
            .catch(() => {
              this.notifier.notify('error', 'Something wrong');
            })
        } else {
          this.notifier.notify('error', this.handleError(err));
        }
        throw err;
      })
  }

  resetPassword(email: string) {
    this.afAuth.fetchSignInMethodsForEmail(email)
      .then((res) => {
        if (res.length === 0) {
          this.notifier.notify('error', 'User with this email does not exist');
        } else {
          this.afAuth.sendPasswordResetEmail(email)
            .then(() => {
              this.notifier.notify('success', 'Email has been sent to ' + email);
            })
            .catch(e => { this.notifier.notify('error', e); throw e })
        }
      })
      .catch(e => { this.notifier.notify('error', e); throw e })
  }

  createUserWithEmailAndPassword(data: RegisterUser) {
    return this.afAuth.createUserWithEmailAndPassword(data.email, data.password)
      .then((res) => {
        res.user?.updateProfile({
          displayName: data.firstname + ' ' + data.lastname,
        })

        if (!res.user?.emailVerified) {
          res.user?.sendEmailVerification()
            .then(() => {
              this.notifier.notify('info', 'Verification email sent to ' + res.user?.email);
            });
        }
        this.notifier.notify('success', 'User successfully created!');
        return res;
      })
      .catch((err: FirebaseError) => {
        this.notifier.notify('error', this.handleError(err));
        throw err;
      })
  }

  async loginWithFacebook(): Promise<firebase.auth.UserCredential | void> {
    return this.afAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then((res) => {
        const providerData = res.user?.providerData.find((itemProvider) => {
          return itemProvider!.providerId === res.additionalUserInfo?.providerId;
        });

        res.user?.updateProfile({ photoURL:
            providerData!.photoURL! + '?access_token=' + (res.credential?.toJSON() as OAuthCredential).accessToken!
        });

        this.notifier.notify('success', 'Login success! Welcome, ' + res.user?.displayName + '!');
        if (!res.user?.emailVerified) {
          res.user?.sendEmailVerification()
            .then(() => {
              this.notifier.notify('info', 'Verification email sent to ' + res.user?.email);
            });
        }
        return res;
      })
      .catch((error) => {
        error.code === 'auth/account-exists-with-different-credential'
          ? this.notifier.notify('warning', 'You have signed up with a different provider for that email.')
          : this.notifier.notify('error', this.handleError(error));
        throw error;
      })
  }

  loginWithGoogle() {
    return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((res) => {
        this.notifier.notify('success', 'Login success! Welcome, ' + res.user?.displayName + '!');
        return res;
      })
      .catch(err => {
        this.notifier.notify('error', this.handleError(err.code));
        throw err;
      })
  }

  isUniqueEmail(email: string): Promise<boolean>  {
    return this.afAuth.fetchSignInMethodsForEmail(email)
      .then((res) => {
        return res.length === 0
      })
  }

  logOut() {
    return this.afAuth.signOut();
  }

  protected handleError(error: FirebaseError): string {
    let message: string;
    switch (error.code) {
      case 'auth/wrong-password':
        message = 'Enter the correct password or choose another login method.';
        break;
      case 'auth/email-already-in-use':
        message = 'Email address is already in use by an existing user.';
        break;
      case 'auth/user-not-found':
        message = 'We could not find user account associated with the email address.';
        break;
      case 'auth/quota-exceeded':
        message = 'You have exceeded the request limit.';
        break;
      default:
        message = 'Oops! Something went wrong. Try again later.';
        break;
    }
    return message;
  }

  private getPreferMethods(methods: string[]) {
    let mtds: string = '';
    methods.forEach((method, index, methods) => {
      (index === methods.length - 1) ? mtds += method : mtds += method + ' / ';
    })
    return mtds;
  }
}
