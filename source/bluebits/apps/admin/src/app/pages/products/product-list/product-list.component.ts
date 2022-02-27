import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService, Product, AlertService } from '@bluebits/products';
import { ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'admin-product-list',
    templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit, OnDestroy {
    destroy$: Subject<any> = new Subject();

    products = [];

    constructor(
        private productsService: ProductsService,
        private alertMessageService: AlertService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this._getAllProducts();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private _getAllProducts() {
        this.productsService
            .getAllProducts()
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: Product[]) => {
                this.products = data;
            });
    }

    onDelete(productId: string) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this product',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.productsService
                    .deleteProduct(productId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(
                        (data) => {
                            this._getAllProducts();
                            this.alertMessageService.getAlertMessage(
                                'Success',
                                `The product "${data.deletedData.name.toUpperCase()}" is deleted`
                            );
                        },
                        () => {
                            this.alertMessageService.getAlertMessage('Error', 'The product is not deleted');
                        }
                    );
            },
            reject: () => {}
        });
    }

    onEdit(productId: string) {
        this.router.navigateByUrl(`/products/form/${productId}`);
    }
}
