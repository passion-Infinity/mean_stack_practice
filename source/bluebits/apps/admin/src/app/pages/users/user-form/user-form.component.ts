import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '@bluebits/products';
import { User, UserService } from '@bluebits/users';
import { Subject, timer } from 'rxjs';
import * as countriesLib from 'i18n-iso-countries';
import { takeUntil } from 'rxjs/operators';

declare const require;

@Component({
    selector: 'admin-user-form',
    templateUrl: './user-form.component.html',
    styles: []
})
export class UserFormComponent implements OnInit, OnDestroy {
    destroy$: Subject<any> = new Subject();

    form: FormGroup;
    get userForm() {
        return this.form.controls;
    }
    countries: any[] = [];
    isEditMode: boolean = false;
    isSubmitted: boolean = false;
    currentUserId: string;
    constructor(
        private userService: UserService,
        private alertMessageService: AlertService,
        private formBuilder: FormBuilder,
        private location: Location,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this._initForm();
        this._getContries();

        this.currentUserId = this.route.snapshot.paramMap.get('userId');
        if (this.currentUserId) {
            this.isEditMode = true;
            this.userService
                .getUser(this.currentUserId)
                .pipe(takeUntil(this.destroy$))
                .subscribe((data) => {
                    this.userForm.name.setValue(data.name);
                    this.userForm.email.setValue(data.email);
                    this.userForm.street.setValue(data.street);
                    this.userForm.phone.setValue(data.phone);
                    this.userForm.apartment.setValue(data.apartment);
                    this.userForm.zip.setValue(data.zip);
                    this.userForm.city.setValue(data.city);
                    this.userForm.country.setValue(data.country);

                    this.userForm.password.setValidators([]);
                    this.userForm.password.updateValueAndValidity();
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
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            phone: ['', Validators.required],
            isAdmin: [false],
            street: [''],
            apartment: [''],
            zip: [''],
            city: [''],
            country: ['']
        });
    }

    private _createUser(user: User): void {
        console.log(user);
        this.userService
            .createUser(user)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (res) => {
                    this.alertMessageService.getAlertMessage('Success', `The user "${res.data.name}" is created`);
                    timer(1500)
                        .toPromise()
                        .then(() => {
                            this.location.back();
                        });
                },
                () => {
                    this.alertMessageService.getAlertMessage('Error', 'The user is not created');
                }
            );
    }
    private _updateUser(user: User): void {
        this.userService
            .updateUser(user)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (data) => {
                    this.alertMessageService.getAlertMessage('Success', `The user "${data}" is updated`);
                    timer(1500)
                        .toPromise()
                        .then(() => {
                            this.location.back();
                        });
                },
                () => {
                    this.alertMessageService.getAlertMessage('Error', 'The user is not updated');
                }
            );
    }

    private _getContries() {
        countriesLib.registerLocale(require('i18n-iso-countries/langs/en.json'));
        this.countries = Object.entries(countriesLib.getNames('en', { select: 'official' })).map((entry) => {
            return {
                id: entry[0],
                name: entry[1]
            };
        });
    }

    onSubmit() {
        this.isSubmitted = true;
        if (this.form.invalid) {
            return;
        }

        const user: User = {
            id: this.currentUserId,
            name: this.userForm.name.value,
            email: this.userForm.email.value,
            password: this.userForm.password.value,
            city: this.userForm.city.value,
            apartment: this.userForm.apartment.value,
            phone: this.userForm.phone.value,
            country: this.userForm.country.value,
            street: this.userForm.street.value,
            zip: this.userForm.zip.value,
            isAdmin: this.userForm.isAdmin.value
        };

        if (this.isEditMode) {
            this._updateUser(user);
        } else {
            this._createUser(user);
        }
    }

    goBack() {
        this.location.back();
    }
}
