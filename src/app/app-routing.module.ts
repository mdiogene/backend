import {NgModule} from '@angular/core';
// import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { UsersComponent } from './components/users/users.component';
import {MaraudesComponent} from './components/maraudes/maraudes.component';
import {LieuComponent} from './components/lieu/lieu.component';
import {RoleComponent} from './components/role/role.component';
import {LoadingComponent} from './components/loading/loading.component';
import {MentionsLegalesComponent} from './components/mentions-legales/mentions-legales.component';


const AppRoutes: Routes = [
  { path: 'users', component: UsersComponent},
  { path: 'login', component: LoginComponent},
  { path: 'navbar', component: NavbarComponent},
  { path: 'lieu', component: LieuComponent},
  { path: 'maraudes', component: MaraudesComponent},
  { path: 'roles', component: RoleComponent},
  { path: 'loading', component: LoadingComponent},
  { path: 'mentionslegales', component: MentionsLegalesComponent},
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(AppRoutes),
   // CommonModule
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
