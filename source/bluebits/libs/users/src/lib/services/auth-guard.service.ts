import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalstorageService } from './localstorage.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
    constructor(private localStorageService: LocalstorageService, private router: Router) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const token = this.localStorageService.getToken();

        if (token) {
            const tokenDecode = JSON.parse(atob(token.split('.')[1]));

            if (tokenDecode.isAdmin && !this._tokenExprire(tokenDecode.exp)) {
                return true;
            }
        }

        this.router.navigateByUrl('/login');
        return false;
    }

    private _tokenExprire(expiration): boolean {
        return Math.floor(Date.now() / 1000) >= expiration;
    }
}
