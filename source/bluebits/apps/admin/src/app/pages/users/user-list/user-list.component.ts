import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@bluebits/products';
import { User, UserService } from '@bluebits/users';
import { ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'admin-user-list',
    templateUrl: './user-list.component.html',
    styles: []
})
export class UserListComponent implements OnInit, OnDestroy {
    destroy$: Subject<any> = new Subject();

    users: User[] = [];
    constructor(
        private alertMessageService: AlertService,
        private userService: UserService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this._getAllUsers();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private _getAllUsers() {
        this.userService
            .getAllUsers()
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: User[]) => {
                this.users = data;
            });
    }

    onDelete(userId: string) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this user',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.userService
                    .deleteUser(userId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(
                        (data) => {
                            this._getAllUsers();
                            this.alertMessageService.getAlertMessage('Success', `The user "${data}" is deleted`);
                        },
                        () => {
                            this.alertMessageService.getAlertMessage('Error', 'The user is not deleted');
                        }
                    );
            },
            reject: () => {}
        });
    }

    onEdit(userId: string) {
        this.router.navigateByUrl(`/users/form/${userId}`);
    }
}
