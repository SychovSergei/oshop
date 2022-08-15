import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from "@angular/router";
import {from, map, Observable, switchMap} from "rxjs";
import {AuthService} from "./auth.service";
import {UserService} from "./user.service";
import {logEvent} from "@angular/fire/analytics";

@Injectable()
export class AdminAuthGuard implements CanActivate{

  constructor(
    private authService:AuthService,
    private userService: UserService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.appUser$
      .pipe(
        map(appUser =>  appUser!.isAdmin)
      )
  }
}
