import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertService, CategoriesService, Category, Product, ProductsService } from '@bluebits/products';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'admin-product-form',
    templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit, OnDestroy {
    destroy$: Subject<any> = new Subject();

    form: FormGroup;
    get productForm() {
        return this.form.controls;
    }
    categories: Category[] = [];
    isSubmitted: boolean = false;
    isEditMode: boolean = false;
    currentProductId: string;
    imageDisplay: string | ArrayBuffer;

    constructor(
        private productsService: ProductsService,
        private categoriesService: CategoriesService,
        private alertMessageService: AlertService,
        private formBuilder: FormBuilder,
        private location: Location,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this._initForm();
        this._getAllCategories();

        this.currentProductId = this.route.snapshot.paramMap.get('productId');
        if (this.currentProductId) {
            this.isEditMode = true;
            this.productsService.getProduct(this.currentProductId).subscribe((product) => {
                this.productForm.name.setValue(product.name);
                this.productForm.description.setValue(product.description);
                this.productForm.category.setValue(product.category);
                this.productForm.brand.setValue(product.brand);
                this.productForm.countInStock.setValue(product.countInStock);
                this.productForm.price.setValue(product.price);
                this.productForm.isFeatured.setValue(product.isFeatured);
                this.productForm.richDescription.setValue(product.richDescription);
                this.imageDisplay = product.image;
                this.productForm.image.setValidators([]);
                this.productForm.image.updateValueAndValidity();
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
            description: ['', Validators.required],
            category: ['', Validators.required],
            brand: ['', Validators.required],
            countInStock: ['', Validators.required],
            price: ['', Validators.required],
            isFeatured: [false],
            richDescription: [''],
            image: ['', Validators.required]
        });
    }

    private _getAllCategories(): void {
        this.categoriesService
            .getAllCategories()
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: Category[]) => {
                this.categories = data;
            });
    }

    private _createPrduct(product: FormData): void {
        this.productsService
            .createProduct(product)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (data) => {
                    this.alertMessageService.getAlertMessage(
                        'Success',
                        `The product "${data.createdData.name.toUpperCase()}" is created`
                    );
                    timer(1500)
                        .toPromise()
                        .then(() => {
                            this.location.back();
                        });
                },
                () => {
                    this.alertMessageService.getAlertMessage('Error', 'The product is not created');
                }
            );
    }
    private _updateProduct(product: FormData): void {
        this.productsService
            .updateProduct(product, this.currentProductId)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (data) => {
                    this.alertMessageService.getAlertMessage(
                        'Success',
                        `The product "${data.updatedData.name.toUpperCase()}" is updated`
                    );
                    timer(1500)
                        .toPromise()
                        .then(() => {
                            this.location.back();
                        });
                },
                () => {
                    this.alertMessageService.getAlertMessage('Error', 'The product is not updated');
                }
            );
    }

    onSubmit() {
        this.isSubmitted = true;
        if (this.form.invalid) {
            return;
        }

        const productFormData = new FormData();
        Object.keys(this.productForm).map((key) => {
            productFormData.append(key, this.productForm[key].value);
        });

        if (this.isEditMode) {
            this._updateProduct(productFormData);
        } else {
            this._createPrduct(productFormData);
        }
    }

    onImageUpload(event) {
        const file = event.target.files[0];
        this.form.patchValue({ image: file });
        this.form.get('image').updateValueAndValidity();
        if (file) {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                this.imageDisplay = fileReader.result;
            };
            fileReader.readAsDataURL(file);
        }
    }

    goBack() {
        this.location.back();
    }
}
