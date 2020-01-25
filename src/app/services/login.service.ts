import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  localUserEmail: string;
  userLoggedIn: boolean;
  userLoggedJSON: any;

  userLoggedInSubject = new Subject<boolean>();
  localUserEmailSubject = new Subject<string>();
  localUser: any;
  setUser: any;
  updateUser: any;
  constructor(public router: Router,
    public angularFireAuth: AngularFireAuth
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
        this.emitLocalUserEmailnSubject();
        this.emitUserLoggedInSubject();
    });
  }

  // Partie Logout
  logoutuser() {
    this.angularFireAuth.auth.signOut().then(() => {
     // this.localUser.isOnline = false;
     // this.updateUser(this.localUser);
     // this.setUser(this.localUser);
      this.router.navigateByUrl('/login');
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
        this.userLoggedIn = false;
        localStorage.removeItem('user');
        this.emitUserLoggedInSubject();
      }, err => {
        console.log('danger', err.message);
      });
  }

  isUserLoggedIn() {
    return JSON.parse(localStorage.getItem('user'));
  }

  async  loginWithGoogle() {
    return await this.angularFireAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }
}



