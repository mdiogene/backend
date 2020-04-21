import {Injectable} from '@angular/core';
import {apiLMT} from '../../environments/environment';
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
import {DialogConfirmationDialogComponent} from '../components/dialog-confirmation-dialog/dialog-confirmation-dialog.component';
import {MatDialog} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class UserAPILMTService {

  private userAPILMTUrl = `${apiLMT.url}/users`;
  // private userAPILMTUrlPut = `${apiLMTput.url}/users`;
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
userAdded = false;

  constructor(private http: HttpClient,
              public fs: AngularFirestore,
              public loginService: LoginService,
              public roleService: RoleApilmtService,
              public loadingService: LoadingService,
              public alertService: AlertService,
              private dialog: MatDialog) {
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

  createUserWithEmailAndPassword(user: User) {

    this.fs.firestore.app.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then((value) => {
        user.userId = value.user.uid;
        this.addUser(user);
        const userAuth = firebase.auth().currentUser;
        userAuth.sendEmailVerification().then(resultOk => {

        }).catch(resultFail => {
          const info = 'Email et/ou password incorrecte, réessayer ...';
          this.openDialog(info);
        });
      });

  }

  addUser(user: User): void {
    this.loadingService.showLoading();

    this.http.post<User>(this.userAPILMTUrl, user).subscribe(
      next => {
        localStorage.setItem('userAdded', JSON.stringify(true));
        this.users[this.users.indexOf(user)] = next;
        this.users.unshift(next);
        const info = 'Utilisateur crée';
        this.openDialog(info);
        this.emitUsersSubject();
        },
      error => {
        const info = 'Utilisateur n\'a pas été crée réessayer ....';
        this.handleError(error);
        this.openDialog(info);    }
    );
  }

  openDialog(information: string): void {
    const dialogRef = this.dialog.open(DialogConfirmationDialogComponent, {
      width: '400px',
      data: {information: information}
    });
  }

  updateUser(user: User): void {
    this.loadingService.showLoading();
    if (user._links) {
      const urlHref = this.getUrlForUpdateAndDelete(user._links.self.href, 'users', `${apiLMT.url}`);
      this.http.put<User>(urlHref, user).subscribe(
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

  getUrlForUpdateAndDelete(url: string, objectToAdd: string, urlToAdd: string): string {
      const urlObject = url.substring(url.indexOf(objectToAdd), url.length );
      const vraiUrl = urlToAdd + '/' + urlObject;
      return vraiUrl;
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

  deleteUser(user: User) {
    const email = this.fs.firestore.app.auth().currentUser.email;
    this.getUserByEmail(email);
    // this.fs.collection('Users').doc(user.userId).delete();
    this.loadingService.showLoading();
    if (user._links) {
      const urlHref = this.getUrlForUpdateAndDelete(user._links.self.href, 'users', `${apiLMT.url}`);

      this.http.delete<User>(urlHref).subscribe(
        next => {
          const info = 'Utilisateur a été suprimé';
          this.openDialog(info);

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
  }

  handleError(error): void {
    this.loadingService.hideLoading();
    this.alertService.error(error.message);
  }
}
