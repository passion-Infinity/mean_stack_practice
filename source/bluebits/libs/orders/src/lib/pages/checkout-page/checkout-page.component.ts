import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderItem } from '../../models/order-item';
import * as countriesLib from 'i18n-iso-countries';
import { Order } from '../../models/order';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart';
import { OrderService } from '@bluebits/orders';

declare const require;

@Component({
    selector: 'orders-checkout-page',
    templateUrl: './checkout-page.component.html',
    styles: []
})
export class CheckoutPageComponent implements OnInit {
    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private cartService: CartService,
        private orderService: OrderService
    ) {}
    checkoutFormGroup: FormGroup;
    isSubmitted = false;
    orderItems: OrderItem[] = [];
    userId: string;
    countries = [];

    ngOnInit(): void {
        this._initCheckoutForm();
        this._getCartItem();
        this._getCountries();
    }

    private _initCheckoutForm() {
        this.checkoutFormGroup = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.email, Validators.required]],
            phone: ['', Validators.required],
            city: ['', Validators.required],
            country: ['', Validators.required],
            zip: ['', Validators.required],
            apartment: ['', Validators.required],
            street: ['', Validators.required]
        });
    }

    private _getCartItem() {
        const cart: Cart = this.cartService.getCart();
        this.orderItems = cart.items.map((item) => {
            return {
                product: item.productId,
                quantity: item.quantity
            };
        });
    }

    private _getCountries() {
        countriesLib.registerLocale(
            require('i18n-iso-countries/langs/en.json')
        );
        this.countries = Object.entries(
            countriesLib.getNames('en', { select: 'official' })
        ).map((entry) => {
            return {
                id: entry[0],
                name: entry[1]
            };
        });
    }

    backToCart() {
        this.router.navigate(['/cart']);
    }

    placeOrder() {
        this.isSubmitted = true;
        if (this.checkoutFormGroup.invalid) {
            return;
        }

        const order: Order = {
            orderItems: this.orderItems,
            user: this.userId,
            shippingAddress1: this.checkoutForm.street.value,
            shippingAddress2: this.checkoutForm.apartment.value,
            city: this.checkoutForm.city.value,
            zip: this.checkoutForm.zip.value,
            country: this.checkoutForm.country.value,
            phone: this.checkoutForm.phone.value,
            status: 0,
            createdAt: `${Date.now()}`
        };

        this.orderService.createOrder(order).subscribe(() => {
            this.cartService.emptyCart();
            this.router.navigate(['/success']);
        });
    }

    get checkoutForm() {
        return this.checkoutFormGroup.controls;
    }
}
