import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

const api = environment.apiURL + '/users';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) {}

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${api}`);
    }

    getUser(userId: string): Observable<User> {
        return this.http.get<User>(`${api}/${userId}`);
    }

    createUser(user: User): Observable<any> {
        return this.http.post<any>(`${api}`, user);
    }

    deleteUser(userId: string): Observable<any> {
        return this.http.delete<any>(`${api}/${userId}`);
    }

    updateUser(user: User): Observable<any> {
        return this.http.put<any>(`${api}/${user.id}`, user);
    }

    getCount(): Observable<any> {
        return this.http.get<any>(`${api}/get/count`);
    }
}
