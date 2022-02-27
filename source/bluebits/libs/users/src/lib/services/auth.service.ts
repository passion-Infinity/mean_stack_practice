import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { LocalstorageService } from './localstorage.service';

const api = environment.apiURL + '/users';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient, private localStorageService: LocalstorageService, private route: Router) {}

    login(email: string, password: string): Observable<any> {
        return this.http.post<any>(`${api}/login`, { email, password });
    }

    logout(): void {
        this.localStorageService.removeToken();
        this.route.navigateByUrl('/login');
    }
}
