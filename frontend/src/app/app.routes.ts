import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { authGuard } from './guards/auth.guard';
import { Home } from './home/home';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'auth/login', component: Login},
    {path: 'auth/register', component: Register},
    { 
    path: 'profile',
    loadComponent: () =>
        import('./profile/profile').then(m => m.Profile),
    canActivate: [authGuard]
    }
];

