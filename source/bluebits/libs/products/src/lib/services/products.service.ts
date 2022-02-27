import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Product } from '../models/product.model';

const api = environment.apiURL + '/products';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    constructor(private http: HttpClient) {}

    getAllProducts(categoriesFilter?: any[]): Observable<Product[]> {
        let params = new HttpParams();
        if (categoriesFilter) {
            params = params.append('categories', categoriesFilter.join(','));
        }
        return this.http.get<Product[]>(`${api}`, { params });
    }

    getProduct(productId: string): Observable<Product> {
        return this.http.get<Product>(`${api}/${productId}`);
    }

    createProduct(product: FormData): Observable<any> {
        return this.http.post<any>(`${api}`, product);
    }

    deleteProduct(productId: string): Observable<any> {
        return this.http.delete<any>(`${api}/${productId}`);
    }

    updateProduct(product: FormData, productId: string): Observable<any> {
        return this.http.put<any>(`${api}/${productId}`, product);
    }

    getCount(): Observable<any> {
        return this.http.get<any>(`${api}/get/count`);
    }

    getFeaturedProducts(count: number): Observable<Product[]> {
        return this.http.get<Product[]>(`${api}/get/featured/${count}`);
    }
}
