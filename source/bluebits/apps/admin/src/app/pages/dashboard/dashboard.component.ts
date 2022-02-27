import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from '@bluebits/orders';
import { ProductsService } from '@bluebits/products';
import { UserService } from '@bluebits/users';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'admin-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
    destroy$: Subject<any> = new Subject();

    totalOrders: any;
    totalProducts: any;
    totalUsers: any;
    totalSales: any;

    constructor(
        private userService: UserService,
        private orderService: OrderService,
        private productsService: ProductsService
    ) {}

    ngOnInit(): void {
        this._getTotalOrders();
        this._getTotalProducts();
        this._getTotalUsers();
        this._getTotalSales();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private _getTotalOrders(): void {
        this.orderService
            .getCount()
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.totalOrders = data.orderCount;
            });
    }

    private _getTotalSales(): void {
        this.orderService
            .getTotalSales()
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.totalSales = data.totalsales;
            });
    }

    private _getTotalProducts(): void {
        this.productsService
            .getCount()
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.totalProducts = data.productCount;
            });
    }

    private _getTotalUsers(): void {
        this.userService
            .getCount()
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.totalUsers = data.userCount;
            });
    }
}
