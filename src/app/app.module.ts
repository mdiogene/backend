import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UsersComponent } from './components/users/users.component';
import {RouterModule, Routes} from '@angular/router';
import {MatPaginatorModule, MatSortModule, MatTableModule} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import {firebaseConfig} from '../environments/environment';
import {AngularFirestore, AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import { LoginComponent } from './components/login/login.component';
import { DonsComponent } from './components/dons/dons.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AppRoutingModule } from './app-routing.module';

import { MaraudesComponent } from './components/maraudes/maraudes.component';
import { LieuComponent } from './components/lieu/lieu.component';
import { RoleComponent } from './components/role/role.component';
import { LoadingComponent } from './components/loading/loading.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { DialogConfirmationDialogComponent } from './components/dialog-confirmation-dialog/dialog-confirmation-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { BesoinsComponent } from './components/besoins/besoins.component';
import { AlimentaireComponent } from './components/besoins/alimentaire/alimentaire.component';
import { HygieneComponent } from './components/besoins/hygiene/hygiene.component';
import { VetementsComponent } from './components/besoins/vetements/vetements.component';
import { ServicesComponent } from './components/besoins/services/services.component';
import { TypeBesoinsComponent } from './components/besoins/type-besoins/type-besoins.component';
import {MentionsLegalesComponent} from './components/mentions-legales/mentions-legales.component';
import { ParticipantsMaraudeComponent } from './components/participants-maraude/participants-maraude.component';
import { ParticipantsBesoinsComponent } from './components/participants-besoins/participants-besoins.component';



const AppRoutes: Routes = [
  { path: 'users', component: UsersComponent},
  { path: 'maraudes', component: MaraudesComponent},
  { path: 'besoins', component: BesoinsComponent},
  { path: 'login', component: LoginComponent},
  { path: 'mentionslegales', component: MentionsLegalesComponent},
  { path: 'role', component: RoleComponent},
  { path: 'loading', component: LoadingComponent},
  { path: 'lieu', component: LieuComponent},
  { path: 'vetements', component: VetementsComponent},
  { path: 'alimentaire', component: AlimentaireComponent},
  { path: 'hygiene', component: HygieneComponent},
  { path: 'services', component: ServicesComponent},
  { path: 'typeBesoins', component: TypeBesoinsComponent},
  { path: 'participantMaraude', component: ParticipantsMaraudeComponent},
  { path: 'participantBesoin', component: ParticipantsBesoinsComponent},
  { path: 'participantMaraude/:maraudeId', component: ParticipantsMaraudeComponent},
  { path: 'dialog', component: DialogConfirmationDialogComponent}
  ];

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    LoginComponent,
    DonsComponent,
    NavbarComponent,
    MaraudesComponent,
    LieuComponent,
    RoleComponent,
    LoadingComponent,
    DialogConfirmationDialogComponent,
    BesoinsComponent,
    AlimentaireComponent,
    HygieneComponent,
    VetementsComponent,
    ServicesComponent,
    TypeBesoinsComponent,
    MentionsLegalesComponent,
    ParticipantsMaraudeComponent,
    ParticipantsBesoinsComponent
  ],
  imports: [

    BrowserModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    CdkTableModule,
    HttpClientModule,
    RouterModule.forRoot(AppRoutes),
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AppRoutingModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    AngularDateTimePickerModule,
    BrowserAnimationsModule
    // AngularFireModule.initializeApp(apiLMT)
  ],
  exports : [
    MatDialogModule
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
