import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { environment } from '@env/environment';

const api = environment.apiURL + '/categories';

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {
    constructor(private http: HttpClient) {}

    getAllCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(`${api}`);
    }

    getCategory(categoryId: string): Observable<Category> {
        return this.http.get<Category>(`${api}/${categoryId}`);
    }

    createCategory(category: Category): Observable<any> {
        return this.http.post<any>(`${api}`, category);
    }

    deleteCategory(categoryId: string): Observable<any> {
        return this.http.delete<any>(`${api}/${categoryId}`);
    }

    updateCategory(category: Category): Observable<any> {
        return this.http.put<any>(`${api}/${category.id}`, category);
    }
}
