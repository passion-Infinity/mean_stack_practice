import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
@Injectable({
    providedIn: 'root'
})
export class AlertService {
    constructor(private messageService: MessageService) {}

    getAlertMessage(
        title: string = 'No title',
        content: string = 'No content'
    ) {
        this.messageService.add({
            severity: title.toLowerCase(),
            summary: title,
            detail: content
        });
    }
}
