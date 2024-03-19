import { Routes } from '@angular/router';
import { HomeComponent } from './feature/components/home/home.component';
import { KnjizareComponent } from './feature/components/knjizare/knjizare.component';
import { provideEffects } from '@ngrx/effects';
import { KnjizaraEffects } from './store/knjizara/knjizara.effects';
import { KnjizaraComponent } from './feature/components/knjizara/knjizara.component';
import { LoginComponent } from './core/components/login/login.component';
import { RegisterComponent } from './core/components/register/register.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: "home", component: HomeComponent },
    { path: "knjizare", component: KnjizareComponent },
    { path: "knjizare/:id", component: KnjizaraComponent },
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
];
