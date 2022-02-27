import { NgModule } from '@angular/core';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ShellComponent } from './shared/shell/shell.component';
import { CategoryListComponent } from './pages/categories/category-list/category-list.component';
import { CategoryFormComponent } from './pages/categories/category-form/category-form.component';
import { ProductListComponent } from './pages/products/product-list/product-list.component';
import { ProductFormComponent } from './pages/products/product-form/product-form.component';
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { UserFormComponent } from './pages/users/user-form/user-form.component';
import { OrderListComponent } from './pages/orders/order-list/order-list.component';
import { OrderDetailComponent } from './pages/orders/order-detail/order-detail.component';
import { AuthGuardService } from '@bluebits/users';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: ShellComponent,
        canActivate: [AuthGuardService],
        children: [
            { path: '', component: DashboardComponent },
            { path: 'categories', component: CategoryListComponent },
            { path: 'categories/form', component: CategoryFormComponent },
            {
                path: 'categories/form/:categoryId',
                component: CategoryFormComponent
            },
            { path: 'products', component: ProductListComponent },
            { path: 'products/form', component: ProductFormComponent },
            { path: 'products/form/:productId', component: ProductFormComponent },
            { path: 'users', component: UserListComponent },
            { path: 'users/form', component: UserFormComponent },
            { path: 'users/form/:userId', component: UserFormComponent },
            { path: 'orders', component: OrderListComponent },
            { path: 'orders/:orderId', component: OrderDetailComponent }
        ]
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' })],
    exports: [RouterModule],
    declarations: [],
    providers: []
})
export class AppRoutingModule {}
