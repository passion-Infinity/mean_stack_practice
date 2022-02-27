import { Component, OnInit } from '@angular/core';
import { CartService } from '@bluebits/orders';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'message',
    templateUrl: './message.component.html',
    styles: []
})
export class MessageComponent implements OnInit {
    constructor(
        private cartSerVice: CartService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.cartSerVice.cart$.subscribe(() => {
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Cart Updated!'
            });
        });
    }
}
