import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Order } from '../models/order';

const api = environment.apiURL + '/orders';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    constructor(private http: HttpClient) {}

    getAllOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${api}`);
    }

    getOrder(orderId: string): Observable<Order> {
        return this.http.get<Order>(`${api}/${orderId}`);
    }

    createOrder(order: Order): Observable<any> {
        return this.http.post<any>(`${api}`, order);
    }

    deleteOrder(orderId: string): Observable<any> {
        return this.http.delete<any>(`${api}/${orderId}`);
    }

    updateOrder(orderStatus: { status: string }, orderId: string): Observable<any> {
        return this.http.put<any>(`${api}/${orderId}`, orderStatus);
    }

    getCount(): Observable<any> {
        return this.http.get<any>(`${api}/get/count`);
    }

    getTotalSales(): Observable<any> {
        return this.http.get<any>(`${api}/get/totalsales`);
    }
}
