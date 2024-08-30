import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { superAdminGuard } from './super-admin.guard';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExploreComponent } from './explore/explore.component';
import { GroupCreationComponent } from './group-creation/group-creation.component';
import { ChannelExploreComponent } from './channel-explore/channel-explore.component';
import { ReportsComponent } from './reports/reports.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch:'full' },
    { path:'login', component:LoginComponent },
    { path:'signup', component:SignupComponent },
    { path:'dashboard', component:DashboardComponent, canActivate: [authGuard] },
    { path:'homepage', component:HomepageComponent, canActivate: [authGuard] },
    { path:'explore', component:ExploreComponent, canActivate: [authGuard] },
    { path:'channel-explore', component:ChannelExploreComponent, canActivate: [authGuard] },
    { path:'group-creation', component:GroupCreationComponent, canActivate: [authGuard] },
    { path:'reports', component:ReportsComponent, canActivate: [authGuard, superAdminGuard] },
];
