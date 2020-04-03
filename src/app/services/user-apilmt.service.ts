import {Injectable} from '@angular/core';
import {apiLMT, apiLMTput} from '../../environments/environment';
import {User} from '../model/User';
import {Subject} from 'rxjs';
import {LoginService} from './login.service';
import {HttpClient} from '@angular/common/http';
import {AlertService} from './alert-service.service';
import {LoadingService} from './loading-service.service';
import {AngularFirestore} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import {RoleApilmtService} from './role-apilmt.service';
import {Role} from '../model/Role';
import {UserToSaveInDB} from '../model/UserToSaveInDB';
import {UserRole} from '../model/UserRole';

@Injectable({
  providedIn: 'root'
})
export class UserAPILMTService {

  private userAPILMTUrl = `${apiLMT.url}/users`;
  private userAPILMTUrlPut = `${apiLMTput.url}/users`;
  private userRolesAPILMTUrl = `${apiLMT.url}/userRoles`;
  users: User[] = [];
  usersSubject = new Subject<User[]>();
  roleIdSubject = new Subject<number>();
  userSubject = new Subject<User>();
  userByEmailSubject = new Subject<User>();
  user = new User();
  userByEmail: User;
  userRoleEnregistre: UserRole;
  userRoles: UserRole[] = [];
  role: Role;
  userToSaveInDb = new UserToSaveInDB();
  userRolesSubject = new Subject<UserRole[]>();

  constructor(private http: HttpClient,
              public fs: AngularFirestore,
              public loginService: LoginService,
              public roleService: RoleApilmtService,
              public loadingService: LoadingService,
              public alertService: AlertService) {
  }

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

  private emitUserRolesSubject() {
    this.userRolesSubject.next(Array.from(this.userRoles));
    this.loadingService.hideLoading();
  }

  getAllUserRoles(): void {
    this.loadingService.showLoading();
    this.http.get<any>(this.userRolesAPILMTUrl).subscribe(
      next => {
        const userRoles = next._embedded.userRoles;
        if (userRoles) {
          this.userRoles = userRoles;
        }
      },
      error => {
        this.handleError(error);
      }
    );
    this.emitUserRolesSubject();
  }


  getAllUsers(): void {
    this.loadingService.showLoading();
    this.http.get<any>(this.userAPILMTUrlPut).subscribe(
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

  createUserWithEmailAndPassword(user: User) {

    this.fs.firestore.app.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then((value) => {
        user.userId = value.user.uid;
        this.addUser(user);
        const userAuth = firebase.auth().currentUser;
        userAuth.sendEmailVerification().then(function () {
        }).catch(function () {
          // An error happened.
        });
      });

  }

  addUser(user: User): void {
    this.loadingService.showLoading();

    this.http.post<User>(this.userAPILMTUrlPut, user).subscribe(
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
    // this.loadingService.showLoading();
    if (user._links) {
      console.log('dans update service test url');
      console.log(user._links.self.href);
      this.http.put<User>(user._links.self.href, user).subscribe(
        next => {
          console.log('dans update service');
          console.log(next);
          this.users[this.users.indexOf(user)] = next;
          this.emitUsersSubject();
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
      this.http.get<User>(this.userAPILMTUrlPut + '/search/findByEmail?email=' + email).subscribe(
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

  deleteUser(user: User) {
    const email = this.fs.firestore.app.auth().currentUser.email;
    this.getUserByEmail(email);
    // this.fs.collection('Users').doc(user.userId).delete();
    this.loadingService.showLoading();
    if (user._links) {
      this.http.delete<User>(user._links.self.href).subscribe(
        next => {
          console.log('user deleted !');
          console.log(next);

          this.users.splice( this.users.indexOf(user), 1);
          this.emitUsersSubject();
          },
        error => {
          this.handleError(error);
        }
      );
    }

    this.fs.firestore.app.auth().signInWithEmailAndPassword(user.email, user.password).then(userToDelete => {
      userToDelete.user.delete();
    });
    // this.fs.firestore.app.auth().signInWithEmailAndPassword(this.userByEmail.email, this.userByEmail.password );
  }

  construireUserToSaveInDB(user: User, role: Role): void {
    this.userToSaveInDb.email = user.email;
    this.userToSaveInDb.name = user.name;
    this.userToSaveInDb.prenom = user.prenom;
    this.userToSaveInDb.password = user.password;
    this.userToSaveInDb.tel = user.tel;
    this.userToSaveInDb.userId = user.userId;
    this.userToSaveInDb.vehicule = user.vehicule;
    this.userToSaveInDb.urlPhoto = user.urlPhoto;
    this.userToSaveInDb.role = role;
  }

  handleError(error): void {
    this.loadingService.hideLoading();
    this.alertService.error(error.message);
  }
}
