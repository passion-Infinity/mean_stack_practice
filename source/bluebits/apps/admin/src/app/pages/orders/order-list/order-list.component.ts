import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Order, OrderService, ORDER_STATUS } from '@bluebits/orders';
import { AlertService } from '@bluebits/products';
import { ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'admin-order-list',
    templateUrl: './order-list.component.html',
    styles: []
})
export class OrderListComponent implements OnInit, OnDestroy {
    destroy$: Subject<any> = new Subject();

    orders: Order[] = [];
    orderStatus = ORDER_STATUS;

    constructor(
        private orderService: OrderService,
        private alertMessageService: AlertService,
        private router: Router,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this._getAllOrders();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private _getAllOrders(): void {
        this.orderService
            .getAllOrders()
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.orders = data;
            });
    }

    onDelete(orderId: string): void {
        this.confirmationService.confirm({
            message: 'Do you want to delete this order',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.orderService
                    .deleteOrder(orderId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(
                        (data) => {
                            this._getAllOrders();
                            this.alertMessageService.getAlertMessage(
                                'Success',
                                `The order "${data.deletedData.name.toUpperCase()}" is deleted`
                            );
                        },
                        () => {
                            this.alertMessageService.getAlertMessage(
                                'Error',
                                'The order is not deleted'
                            );
                        }
                    );
            },
            reject: () => {}
        });
    }

    showOrder(orderId: string): void {
        this.router.navigateByUrl(`/orders/${orderId}`);
    }
}
