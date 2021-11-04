import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';

import { AuthGuard } from './common';
import { JwtInterceptor, ErrorInterceptor } from './common';
import { AlertComponent } from './components';
import { AboutComponent } from './about/about.component';
import { ContactUsComponent } from './contactus/contactus.component';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const usersModule = () => import('./user/users.module').then(x => x.UsersModule);


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    AboutComponent,
    ContactUsComponent,
    CounterComponent,
    AlertComponent,
    FetchDataComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'users', loadChildren: usersModule, canActivate: [AuthGuard] },
      { path: 'account', loadChildren: accountModule },
      { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'counter', component: CounterComponent, canActivate: [AuthGuard] },
      { path: 'about', component: AboutComponent },
      { path: 'contactus', component: ContactUsComponent },
      { path: 'fetch-data', component: FetchDataComponent, canActivate: [AuthGuard] },
      { path: '**', redirectTo: '' }
    ])
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
