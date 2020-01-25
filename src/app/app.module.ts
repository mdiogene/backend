import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UsersComponent } from './components/users/users.component';
import {RouterModule, Routes} from '@angular/router';
import {MatTableModule} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import {apiLMT, firebaseConfig} from '../environments/environment';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import { LoginComponent } from './components/login/login.component';
import { DonsComponent } from './components/dons/dons.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AppRoutingModule } from './app-routing.module';

const AppRoutes: Routes = [
  { path: 'users', component: UsersComponent},
  { path: 'login', component: LoginComponent},
//  { path: 'navbar', component: NavbarComponent},

];

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    LoginComponent,
    DonsComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    MatTableModule,
    CdkTableModule,
    HttpClientModule,
    RouterModule.forRoot(AppRoutes),
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AppRoutingModule
    // AngularFireModule.initializeApp(apiLMT)
  ],
  providers: [
    AngularFireAuth,
    AngularFireModule,
    AngularFirestore,
    AngularFirestoreModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }