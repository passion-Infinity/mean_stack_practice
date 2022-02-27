import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '@bluebits/products';
import { LocalstorageService } from '../../services/localstorage.service';
import { Router } from '@angular/router';

@Component({
    selector: 'user-login',
    templateUrl: './login.component.html',
    styles: []
})
export class LoginComponent implements OnInit {
    isSubmitted: boolean = false;
    loginFormGroup: FormGroup;
    isLoginError: boolean = false;
    errorMessage: string;

    get emailInput() {
        return this.loginFormGroup.get('email');
    }

    get passwordInput() {
        return this.loginFormGroup.get('password');
    }

    constructor(
        private formBuilder: FormBuilder,
        private auth: AuthService,
        private alertMessageService: AlertService,
        private localStorageService: LocalstorageService,
        private route: Router
    ) {}

    ngOnInit(): void {
        this._initForm();
    }

    private _initForm(): void {
        this.loginFormGroup = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    onSubmit(): void {
        this.isSubmitted = true;
        if (this.loginFormGroup.invalid) {
            return;
        }

        this.auth.login(this.emailInput.value, this.passwordInput.value).subscribe(
            (data) => {
                this.alertMessageService.getAlertMessage('Success', `Login successfully`);
                this.isLoginError = false;
                this.localStorageService.setToken(data.token);
                this.route.navigateByUrl('/');
            },
            (err: HttpErrorResponse) => {
                this.alertMessageService.getAlertMessage('Error', `Login failed`);
                this.isLoginError = true;
                this.errorMessage = err.error.message;
                if (err.status !== 400) {
                    this.errorMessage = 'Error in server, please try again';
                }
            }
        );
    }
}
