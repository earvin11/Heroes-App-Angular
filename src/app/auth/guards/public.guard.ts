import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { tap, map } from 'rxjs';

import { AuthService } from '../services/auth.service';



export const publicRoute = ( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ) => {

    // inyectar servicio dentro de funciones
    const authService = inject( AuthService );
    const router      = inject( Router );

    // esto es un observable de authService
    return authService.checkAuthentication()
        .pipe(
            tap( isAuth => {
                if( isAuth ) {
                    router.navigate(['./heroes/list']);
                }
            }),
            map( isAuth => !isAuth )
        )

}