import { Injectable } from '@angular/core';
import {apiLMT} from '../../environments/environment';
import {User} from '../model/User';
import {Subject} from 'rxjs';
import {LoginService} from './login.service';
import {HttpClient} from '@angular/common/http';
import {AlertService} from './alert-service.service';
import {LoadingService} from './loading-service.service';
import {AngularFirestore} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class UserAPILMTService {

  private userAPILMTUrl = `${apiLMT.url}/users`;
  users: User[] = [];
  usersSubject = new Subject<User[]>();
  userSubject = new Subject<User>();
  userByEmailSubject = new Subject<User>();
  user = new User();
  userByEmail: User;
  loggedUserEmail;
  constructor(private http: HttpClient,
              public fs: AngularFirestore,
              public loginService: LoginService,
              public loadingService: LoadingService,
              public alertService: AlertService) { }

  emitUserSubject() {
    this.userSubject.next(this.user);
    this.loadingService.hideLoading();
  }

  emitUsersSubject() {
    if (this.users) {
      this.usersSubject.next(Array.from(this.users));
    }
    this.loadingService.hideLoading();
  }

  emitUserByEmailSubject() {
    this.userByEmailSubject.next(this.userByEmail);
    this.loadingService.hideLoading();
  }

  getCurrentUserEmail(): string {
    this.loggedUserEmail = this.loginService.localUserEmail;
    return this.loggedUserEmail;
  }

  getAllUsers(): void {
    this.loadingService.showLoading();
    this.http.get<any>(this.userAPILMTUrl).subscribe(
      next => {
        const users = next._embedded.users;
        if (users && users.length > 0) {
          this.users = next._embedded.users;
        }
        this.emitUsersSubject();
      },
      error => {
        console.log(error);
        this.handleError(error);
      }
    );
  }

  createUserWithEmailAndPassword (user: User) {

    console.log(user);
    // this.userRegistered = false;
    this.fs.firestore.app.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then((value) => {

        console.log('user0');
        console.log(user);
         user.userId = value.user.uid;
         this.addUser(user);

        console.log('user1');
        console.log(user);
         const userAuth = firebase.auth().currentUser;
        // userAuth.updateProfile({
        //   displayName: user.prenom + ' ' + user.name
        // });
        userAuth.sendEmailVerification().then(function() {

          console.log('email sent to ' + this.userAuth.email + '.');
        }).catch(function() {
          // An error happened.
        });
      });

  }

  addUser(user: User): void {
    this.loadingService.showLoading();
    this.http.post<User>(this.userAPILMTUrl, user).subscribe(
      next => {
        this.users[this.users.indexOf(user)] = next;
        this.users.unshift(next);
        this.emitUsersSubject();
      },
      error => {
        this.handleError(error);
      }
    );
  }

  updateUser(user: User): void {
    console.log(user);
    this.loadingService.showLoading();
    if (user._links) {
      this.http.put<User>(user._links.self.href, user).subscribe(
        next => {
          this.users[this.users.indexOf(user)] = next;
          this.emitUserSubject();
          console.log(next);
        },
        error => {
          this.handleError(error);
        }
      );
    }
  }
  getUserByEmail(email: string): void {
    this.loadingService.showLoading();
    this.userByEmail = null;
    if (email) {
      this.http.get<User>(this.userAPILMTUrl + '/search/findByEmail?email=' + email).subscribe(
        next => {
          if (next) {
            this.userByEmail = next;
          }
          this.emitUserByEmailSubject();
        },
        error => {
           this.handleError(error);
        }
      );
    }
  }

  getUserByFirebaseId(firebaseId: string): void {
    this.loadingService.showLoading();
    this.userByEmail = null;
    if (firebaseId) {
      this.http.get<User>(this.userAPILMTUrl + '/search/findByUserId?userId=' + firebaseId).subscribe(
        next => {
          if (next) {
            this.user = next;
          }
          this.emitUserSubject();
        },
        error => {
           this.handleError(error);
        }
      );
    }
  }
  handleError(error): void {
    this.loadingService.hideLoading();
    this.alertService.error(error.message);
  }
}
