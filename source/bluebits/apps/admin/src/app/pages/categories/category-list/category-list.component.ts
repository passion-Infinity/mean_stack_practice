import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, CategoriesService, Category } from '@bluebits/products';
import { ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'admin-category',
    templateUrl: './category-list.component.html'
})
export class CategoryListComponent implements OnInit, OnDestroy {
    categories: Category[] = [];
    destroy$: Subject<any> = new Subject();

    constructor(
        private alertMessageService: AlertService,
        private categoriesService: CategoriesService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this._getAllCategories();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private _getAllCategories() {
        this.categoriesService
            .getAllCategories()
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: Category[]) => {
                this.categories = data;
            });
    }

    onDelete(categoryId: string) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this category',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.categoriesService
                    .deleteCategory(categoryId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(
                        (data) => {
                            this._getAllCategories();
                            this.alertMessageService.getAlertMessage(
                                'Success',
                                `The category "${data.deletedData.name.toUpperCase()}" is deleted`
                            );
                        },
                        () => {
                            this.alertMessageService.getAlertMessage('Error', 'The category is not deleted');
                        }
                    );
            },
            reject: () => {}
        });
    }

    onEdit(categoryId: string) {
        this.router.navigateByUrl(`/categories/form/${categoryId}`);
    }
}
