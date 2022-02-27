import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '@bluebits/orders';
import { ProductsService } from '@bluebits/products';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CartItemDetail } from '../../models/cart';

@Component({
    selector: 'orders-cart-page',
    templateUrl: './cart-page.component.html',
    styles: []
})
export class CartPageComponent implements OnInit, OnDestroy {
    cartItemDetail: CartItemDetail[] = [];
    endSubs$: Subject<any> = new Subject();
    count: number = 0;

    constructor(
        private route: Router,
        private cartService: CartService,
        private productService: ProductsService
    ) {}

    ngOnInit(): void {
        this._getCartDetails();
    }

    ngOnDestroy(): void {
        this.endSubs$.next();
        this.endSubs$.complete();
    }

    private _getCartDetails() {
        this.cartService.cart$
            .pipe(takeUntil(this.endSubs$))
            .subscribe((cart) => {
                this.cartItemDetail = [];
                this.count = cart?.items?.length ?? 0;
                cart.items.forEach((cartItem) => {
                    this.productService
                        .getProduct(cartItem.productId)
                        .pipe(take(1))
                        .subscribe((product) => {
                            this.cartItemDetail.push({
                                product: product,
                                quantity: cartItem.quantity
                            });
                        });
                });
            });
    }

    backToShop() {
        this.route.navigate(['/products']);
    }

    deleteCartItem(productId: string) {
        this.cartService.deleteCartItem(productId);
    }

    updateCartItemQuantity(event, cartItem: CartItemDetail) {
        console.log(event.value);
        this.cartService.setCartItem(
            {
                productId: cartItem.product.id,
                quantity: event.value
            },
            true
        );
    }
}
