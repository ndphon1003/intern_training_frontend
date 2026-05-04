import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Logout } from './features/auth/logout/logout';
import { Register } from './features/auth/register/register';
import { authGuard } from './features/guards/auth.guard';
import { Home } from './features/home/home';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'auth/login', component: Login},
    {path: 'auth/register', component: Register},
    {path: 'auth/logout', component: Logout},
    { 
    path: 'product-management',
    loadComponent: () =>
        import('./features/product-management/product-management').then(m => m.ProductManagement),
    canActivate: [authGuard]
    },
    { 
    path: 'product-creation',
    loadComponent: () =>
        import('./features/product-creation/product-creation').then(m => m.ProductCreation),
    canActivate: [authGuard]
    },
    { 
    path: 'profile',
    loadComponent: () =>
        import('./features/profile/profile').then(m => m.Profile),
    canActivate: [authGuard]
    }
];

