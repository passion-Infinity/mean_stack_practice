import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Category } from '../../models/category.model';
import { Product } from '../../models/product.model';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';

@Component({
    selector: 'products-product-list',
    templateUrl: './product-list.component.html',
    styles: []
})
export class ProductListComponent implements OnInit, OnDestroy {
    products: Product[] = [];
    categories: Category[] = [];
    endSubs$: Subject<any> = new Subject();
    selectedCategories: any[] = [];
    isCategories: boolean = false;

    constructor(
        private productService: ProductsService,
        private categoriesService: CategoriesService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            params.categoryId
                ? this._getAllProducts([params.categoryId])
                : this._getAllProducts();
            params.categoryId
                ? (this.isCategories = true)
                : (this.isCategories = false);
        });
        this._getAllProducts();
        this._getAllCategories();
    }

    ngOnDestroy(): void {
        this.endSubs$.next();
        this.endSubs$.complete();
    }

    private _getAllProducts(categoriesFilter?: any[]) {
        this.productService
            .getAllProducts(categoriesFilter)
            .pipe(takeUntil(this.endSubs$))
            .subscribe((products) => {
                this.products = products;
            });
    }

    private _getAllCategories() {
        this.categoriesService
            .getAllCategories()
            .pipe(takeUntil(this.endSubs$))
            .subscribe((categories) => {
                this.categories = categories;
            });
    }

    categoryFilter() {
        let selectedCategories = this.categories
            .filter((item) => item.checked)
            .map((item) => item.id);
        this._getAllProducts(selectedCategories);
    }
}
