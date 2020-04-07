import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {DialogConfirmationDialogComponent} from '../components/dialog-confirmation-dialog/dialog-confirmation-dialog.component';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  localUserEmail: string;
  userLoggedIn: boolean;
  userLoggedJSON: any;

  userLoggedInSubject = new Subject<boolean>();
  localUserEmailSubject = new Subject<string>();
  constructor(
    public angularFireAuth: AngularFireAuth,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.angularFireAuth.authState.subscribe(userResponse => {
      if (userResponse) {
        localStorage.setItem('user', JSON.stringify(userResponse));

        if (localStorage.user.operationType === 'signIn') {
          this.localUserEmail = userResponse.email;
          this.userLoggedIn = true;

        }
        this.emitLocalUserEmailnSubject();
        this.emitUserLoggedInSubject();
        this.userLoggedJSON = userResponse;

      } else {
        localStorage.setItem('user', null);
      }
    });
    this.userLoggedIn = (Boolean)(localStorage.getItem('userLoggedIn'));
    this.emitUserLoggedInSubject();
  }

  emitUserLoggedInSubject() {
    this.userLoggedInSubject.next(this.userLoggedIn);
  }


  emitLocalUserEmailnSubject() {
    this.localUserEmailSubject.next(this.localUserEmail);
  }

  async login(email: string, password: string) {
      return await this.angularFireAuth.auth.signInWithEmailAndPassword(email, password).then(userStatusIsOnline => {
        this.userLoggedIn = true;
        this.localUserEmail = userStatusIsOnline.user.email;
        localStorage.setItem('localUserEmail', JSON.stringify(this.localUserEmail));
        const info = 'Utilisateur connecté avec succès ...';
        this.openDialog(info);
        this.emitLocalUserEmailnSubject();
        this.emitUserLoggedInSubject();
        localStorage.setItem('userLoggedIn', JSON.stringify(true));
        this.userLoggedIn = (Boolean)(localStorage.getItem('userLoggedIn'));

    }).catch(error => {
        const info = 'Email et ou password incorrecte, réessayer ...';
        this.openDialog(info);
      });
  }

  openDialog(information: string): void {
    const dialogRef = this.dialog.open(DialogConfirmationDialogComponent, {
      width: '400px',
      data: {information: information}
    });
  }
  async logout() {
    this.userLoggedIn = false;

    return await this.angularFireAuth.auth.signOut();
  }

  afterLogout() {
    this.logout();
    this.logout()
      .then(res => {
        localStorage.removeItem('user');
        localStorage.removeItem('userLoggedIn');
        this.userLoggedIn = false;
        this.emitUserLoggedInSubject();
        this.router.navigate(['/']);
      }, err => {
        console.log('danger', err.message);
      });
  }

  isUserLoggedIn() {
    // return JSON.parse(localStorage.getItem('user'));
   return localStorage.getItem('userLoggedIn');
  }

  async  loginWithGoogle() {
    return await this.angularFireAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }
}




