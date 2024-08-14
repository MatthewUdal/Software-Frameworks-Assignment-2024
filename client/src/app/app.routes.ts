import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch:'full' },
    { path:'login', component:LoginComponent },
    { path:'homepage', component:HomepageComponent, canActivate: [authGuard]  }
];
