import {Component, OnInit, OnDestroy} from '@angular/core';
import {User} from '../../model/User';
import {Subscription} from 'rxjs';
import {UsersService} from '../../services/users.service';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {LoginService} from '../../services/login.service';
import {UserAPILMTService} from '../../services/user-apilmt.service';
import {Role} from '../../model/Role';
import {RoleApilmtService} from '../../services/role-apilmt.service';
import {UserToSaveInDB} from '../../model/UserToSaveInDB';
import {UserRole} from '../../model/UserRole';
// import {sha1} from '@angular/compiler/src/i18n/digest';
// import {sha1} from '@angular/compiler/src/i18n/digest';
import * as crypto from 'crypto-js';
import {sha1} from '@angular/compiler/src/i18n/digest';
import {Md5} from 'ts-md5';
import {DialogConfirmationDialogComponent} from '../dialog-confirmation-dialog/dialog-confirmation-dialog.component';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {


  userToModify = new Map<string, User>();
  displayedColumnsUsers: string[] = ['Nom', 'Prénom', 'Email', 'Password', 'TelNumber', 'Role', 'Vehicule', 'URL', 'Actions'];
  userByEmail: User;
  users: User[] = [];
  roles: Role[] = [];
  usersMatTable: MatTableDataSource<User> = new MatTableDataSource<User>(this.users);
  usersSubscription: Subscription;
  userByEmailSubscription: Subscription;
  localUserEmailSubscription: Subscription;
  // userLoggedInSubscrition: Subscription;
  userLoggedIn: boolean;
  signedInUserEmail: string;
  infoToUser: string;
  infoToUserAdminOrNot: string;
  displayedName: string;
  rolesSubscription: Subscription;
  userTaSaveInDb: UserToSaveInDB;
  userRole: Role;
  userRoleMap: Map<number, Role> = new Map();
  roleById: Role;
  roleSubscription: Subscription;
  roleId: number;
  roleIdSubscription: Subscription;
  userIdRoleIdMap: Map<number, number> = new Map();
  userRoles: UserRole[] = [];
  userRolesSubscription: Subscription;
  roleIdRoleMap: Map<number, Role> = new Map();

  constructor(private usersService: UsersService,
              private loginService: LoginService,
              private userAPILMTService: UserAPILMTService,
              private roleAPILMTService: RoleApilmtService,
              private dialog: MatDialog) {
  }

  ngOnInit() {

    this.usersSubscription = this.userAPILMTService.usersSubject.subscribe(
      (users: User[]) => {
        this.users = users;
        this.usersMatTable.data = this.users;
        this.usersMatTable._updateChangeSubscription();
      }
    );

    this.userByEmailSubscription = this.userAPILMTService.userByEmailSubject.subscribe(
      (user: User) => {
        this.userByEmail = user;
      }
    );

    this.localUserEmailSubscription = this.loginService.localUserEmailSubject.subscribe(
      (email: string) => {
        this.signedInUserEmail = email;
      }
    );

    if (localStorage.getItem('userLoggedIn')) {
      this.userLoggedIn = true;
    } else {
      this.userLoggedIn = false;
    }
    this.rolesSubscription = this.roleAPILMTService.rolesSubject.subscribe(
      (roles: Role[]) => {
        this.roles = roles;
        // this.onRolesReceived(this.roles);
      }
    );


    this.roleSubscription = this.roleAPILMTService.roleSubject.subscribe(
      (role: Role) => {
        this.roleById = role;
      }
    );

    this.roleIdSubscription = this.userAPILMTService.roleIdSubject.subscribe(
      (idRole: number) => {
        this.roleId = idRole;

      }
    );

    this.userRolesSubscription = this.userAPILMTService.userRolesSubject.subscribe(
      (userRoles: UserRole[]) => {
        this.userRoles = userRoles;
      }
    );
    this.roleAPILMTService.getAllRoles();
    this.userAPILMTService.getAllUsers();
  }

  getDisplayedNames(): string {
    if (this.loginService.localUserEmail) {
      this.userAPILMTService.getUserByEmail(this.loginService.localUserEmail);
      this.displayedName = 'Logged user : ' + this.userByEmail.prenom + ' ' + this.userByEmail.name;
    } else {
      this.displayedName = '';
    }
    return this.displayedName;
  }

  onCreateNewUsersClick(): void {
    const newUser = new User();
    newUser.isOnUpdate = true;
    const localUserEmail = (String)(localStorage.getItem('localUserEmail'));
    this.userAPILMTService.getUserByEmail(localUserEmail);
    console.log('email of logged user :');
    console.log(localUserEmail);
    this.usersMatTable.data.unshift(newUser);
    this.usersMatTable._updateChangeSubscription();
  }

  onEditButtonClick(user: User) {
    let localUserEmail = (localStorage.getItem('localUserEmail'));
    const end = localUserEmail.length - 1;
    localUserEmail = localUserEmail.substring(1, end);
    this.userAPILMTService.getUserByEmail(localUserEmail);
    console.log('email of logged user :');
    console.log(localUserEmail);
    this.userToModify.set(user._links.self.href, this.cloneObject(user));
    user.isOnUpdate = true;
    // this.onSaveButtonClick(user);
  }

  onDeleteButtonClick(user: User) {
    this.userAPILMTService.deleteUser(user);
    this.usersMatTable._updateChangeSubscription();
  }

  onSaveButtonClick(user: User) {
    user.isOnUpdate = false;

    console.log('user logged is :');
    console.log(this.userByEmail);
    if (this.userByEmail.role.roleName === 'Administrateur') {
      if (user._links) {
        this.userAPILMTService.updateUser(user);
        this.userToModify.delete(user._links.self.href);
      } else {
        user.password = Md5.hashStr(user.password).toString();
        this.userAPILMTService.createUserWithEmailAndPassword(user);
      }
    } else {
      const info = 'Vous n\'êtes pas autorisé à faire cet operation.';
      this.openDialog(info);
    }
  }
  openDialog(information: string): void {
    const dialogRef = this.dialog.open(DialogConfirmationDialogComponent, {
      width: '400px',
      data: {information: information}
    });
  }

  onCancelButtonClick(user: User) {
    user.isOnUpdate = false;
    if (user._links.self.href) {
      this.copieObject(this.userToModify.get(user._links.self.href), user);
      this.userToModify.delete(user._links.self.href);
    } else {
      this.usersMatTable.data.splice(this.usersMatTable.data.indexOf(user), 1);
    }
    this.usersMatTable._updateChangeSubscription();
  }


  cloneObject(src): User {
    const target = new User();
    for (const prop in src) {
      if (src.hasOwnProperty(prop)) {
        target[prop] = src[prop];
      }
    }
    return target;
  }

  copieObject(src: User, target: User): User {
    for (const prop in src) {
      if (src.hasOwnProperty(prop)) {
        target[prop] = src[prop];
      }
    }
    return target;
  }


  ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
  }
}
