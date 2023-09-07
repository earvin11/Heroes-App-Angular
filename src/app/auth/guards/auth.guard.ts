import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivateFn,
    CanMatchFn,
    Route,
    Router,
    RouterStateSnapshot,
    UrlSegment,
  } from '@angular/router';

import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';


  const checkAuthStatus = (): boolean | Observable<boolean> => {
    const authService = inject( AuthService );
    const router = inject( Router );

    return authService.checkAuthentication()
      .pipe(
        tap( isAuthenticated => {
          if( !isAuthenticated ) {
            router.navigate(['./auth/login'])
          }
        })
      )
  };
   
  export const canActivateGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) => {
    // return true;

    return checkAuthStatus();
  };
   
  export const canMatchGuard: CanMatchFn = (
    route: Route,
    segments: UrlSegment[]
  ) => {   
    // return true;

    return checkAuthStatus();
  };