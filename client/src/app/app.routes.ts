import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch:'full' },
    { path:'login', component:LoginComponent },
    { path:'signup', component:SignupComponent },
    { path:'homepage', component:HomepageComponent, canActivate: [authGuard]  }
];
