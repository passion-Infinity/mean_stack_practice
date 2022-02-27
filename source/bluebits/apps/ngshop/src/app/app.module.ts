import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { AccordionModule } from 'primeng/accordion';
import { NavComponent } from './shared/nav/nav.component';
import { ProductsModule } from '@bluebits/products';
import { UiModule } from '@bluebits/ui';
import { HttpClientModule } from '@angular/common/http';
import { OrdersModule } from '@bluebits/orders';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MessageComponent } from './shared/message/message.component';
import { UsersModule } from '@bluebits/users';

const routes: Routes = [{ path: '', component: HomePageComponent }];
@NgModule({
    declarations: [
        AppComponent,
        HomePageComponent,
        HeaderComponent,
        FooterComponent,
        NavComponent,
        MessageComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes),
        BrowserAnimationsModule,
        AccordionModule,
        ProductsModule,
        HttpClientModule,
        UiModule,
        OrdersModule,
        ToastModule,
        UsersModule
    ],
    providers: [MessageService],
    bootstrap: [AppComponent]
})
export class AppModule {}
