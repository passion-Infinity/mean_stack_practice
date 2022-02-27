import { Location } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, OrderService, ORDER_STATUS } from '@bluebits/orders';
import { AlertService } from '@bluebits/products';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'admin-order-detail',
    templateUrl: './order-detail.component.html',
    styles: []
})
export class OrderDetailComponent implements OnInit, OnDestroy {
    destroy$: Subject<any> = new Subject();

    order: Order;
    currentOrderId: string;
    orderStatuses: any[] = [];
    selectedStatus: any;

    constructor(
        private orderService: OrderService,
        private route: ActivatedRoute,
        private alertMessageService: AlertService,
        private location: Location
    ) {}

    ngOnInit(): void {
        this.currentOrderId = this.route.snapshot.paramMap.get('orderId');
        if (this.currentOrderId) {
            this._getOrder(this.currentOrderId);
        }

        this._mapOrderStatus();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private _mapOrderStatus() {
        this.orderStatuses = Object.keys(ORDER_STATUS).map((key) => {
            return {
                id: key,
                name: ORDER_STATUS[key].label
            };
        });
    }

    private _getOrder(orderId: string): void {
        this.orderService
            .getOrder(orderId)
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: Order) => {
                this.order = data;
                this.selectedStatus = data.status;
            });
    }

    onChangeStatus(event) {
        this.orderService
            .updateOrder({ status: event.value }, this.currentOrderId)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (data) => {
                    this.alertMessageService.getAlertMessage(
                        'Success',
                        `The order is updated`
                    );
                    timer(1500)
                        .toPromise()
                        .then(() => {
                            this.location.back();
                        });
                },
                () => {
                    this.alertMessageService.getAlertMessage(
                        'Error',
                        'The order is not updated'
                    );
                }
            );
    }
}
