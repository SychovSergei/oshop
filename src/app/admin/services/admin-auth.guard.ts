import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from "@angular/router";
import {map, of, Observable, switchMap} from "rxjs";
import {AuthService} from "../../shared/services/auth.service";
import {UserService} from "../../shared/services/user.service";

@Injectable()
export class AdminAuthGuard implements CanActivate{

  constructor(
    private authService:AuthService,
    private userService: UserService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.user$
      .pipe(
        switchMap(user => {
                  if (user) return this.userService.get(user?.uid);
                  return of(null);
                }),
        map(appUser =>  appUser!.isAdmin)
      )
  }
}
