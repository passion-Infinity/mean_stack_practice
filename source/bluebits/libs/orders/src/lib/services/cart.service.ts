import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models/cart';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    CART_KEY = 'cart';
    cart$: BehaviorSubject<Cart> = new BehaviorSubject(this.getCart());
    constructor() {}

    initCartLocalStorage() {
        const cart = this.getCart();
        if (!cart) {
            const initCart = {
                items: []
            };

            localStorage.setItem('cart', JSON.stringify(initCart));
        }
    }

    emptyCart() {
        const initCart = {
            items: []
        };
        localStorage.setItem('cart', JSON.stringify(initCart));
        this.cart$.next(initCart);
    }

    getCart(): Cart {
        const cart = JSON.parse(localStorage.getItem(this.CART_KEY));
        return cart;
    }

    setCartItem(cartItem: CartItem, updateCartItem?: boolean): Cart {
        const cart = this.getCart();
        const cartItemExist = cart.items.find(
            (item) => item.productId === cartItem.productId
        );
        if (cartItemExist) {
            cart.items.every((item) => {
                if (item.productId === cartItem.productId) {
                    if (updateCartItem) {
                        item.quantity = cartItem.quantity;
                    } else {
                        item.quantity += cartItem.quantity;
                    }
                    return false;
                }
                return true;
            });
        } else {
            cart.items.push(cartItem);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        this.cart$.next(cart);
        return cart;
    }

    deleteCartItem(productId: string) {
        const cart = this.getCart();
        const newCart = cart.items.filter(
            (item) => item.productId !== productId
        );
        cart.items = newCart;
        localStorage.setItem('cart', JSON.stringify(cart));
        this.cart$.next(cart);
    }
}
