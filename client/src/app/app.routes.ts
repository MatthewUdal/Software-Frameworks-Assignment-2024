import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch:'full' },
    { path:'login', component:LoginComponent },
    { path:'signup', component:SignupComponent },
    { path:'dashboard', component:DashboardComponent, canActivate: [authGuard] },
    { path:'homepage', component:HomepageComponent, canActivate: [authGuard] },
];
