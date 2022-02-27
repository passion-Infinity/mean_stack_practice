import { Location } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertService, CategoriesService, Category } from '@bluebits/products';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'admin-category-form',
    templateUrl: './category-form.component.html',
    styles: []
})
export class CategoryFormComponent implements OnInit, OnDestroy {
    destroy$: Subject<any> = new Subject();

    form: FormGroup;
    get categoryForm() {
        return this.form.controls;
    }
    isSubmitted: boolean = false;
    isEditMode: boolean = false;
    currentCategoryId: string;

    constructor(
        private alertMessageService: AlertService,
        private formBuilder: FormBuilder,
        private categoriesService: CategoriesService,
        private location: Location,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this._initForm();

        this.currentCategoryId = this.route.snapshot.paramMap.get('categoryId');
        if (this.currentCategoryId) {
            this.isEditMode = true;
            this.categoriesService
                .getCategory(this.currentCategoryId)
                .pipe(takeUntil(this.destroy$))
                .subscribe((data: Category) => {
                    this.categoryForm.name.setValue(data.name);
                    this.categoryForm.icon.setValue(data.icon);
                    this.categoryForm.color.setValue(data.color);
                });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private _initForm(): void {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            icon: ['', Validators.required],
            color: ['#fff']
        });
    }

    onSubmit() {
        this.isSubmitted = true;
        if (this.form.invalid) {
            return;
        }

        const category: Category = {
            id: this.currentCategoryId,
            name: this.categoryForm.name.value,
            icon: this.categoryForm.icon.value,
            color: this.categoryForm.color.value
        };

        if (this.isEditMode) {
            this._updateCategory(category);
        } else {
            this._createCategory(category);
        }
    }

    private _createCategory(category: Category) {
        this.categoriesService
            .createCategory(category)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (data) => {
                    this.alertMessageService.getAlertMessage(
                        'Success',
                        `The category "${data.createdData.name.toUpperCase()}" is created`
                    );
                    timer(1500)
                        .toPromise()
                        .then(() => {
                            this.location.back();
                        });
                },
                () => {
                    this.alertMessageService.getAlertMessage('Error', 'The category is not created');
                }
            );
    }

    private _updateCategory(category: Category) {
        this.categoriesService
            .updateCategory(category)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (data) => {
                    this.alertMessageService.getAlertMessage(
                        'Success',
                        `The category "${data.updatedData.name.toUpperCase()}" is updated`
                    );
                    timer(1500)
                        .toPromise()
                        .then(() => {
                            this.location.back();
                        });
                },
                () => {
                    this.alertMessageService.getAlertMessage('Error', 'The category is not updated');
                }
            );
    }

    goBack() {
        this.location.back();
    }
}
