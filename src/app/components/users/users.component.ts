import { Component, OnInit, OnDestroy } from '@angular/core';
import {User} from '../../model/User';
import {Subscription} from 'rxjs';
import {UsersService} from '../../services/users.service';
import {MatTableDataSource} from '@angular/material';
import {LoginService} from '../../services/login.service';
import {UserAPILMTService} from '../../services/user-apilmt.service';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {


  userToModify = new Map<string, User>();
  displayedColumnsUsers: string[] = ['Nom', 'Prénom', 'Email', 'Password', 'Admin', 'URL', 'Actions'];
  userByEmail: User;
  users: User[] = [];
  usersMatTable: MatTableDataSource<User>  = new MatTableDataSource<User>(this.users);
  usersSubscription: Subscription;
  userByEmailSubscription: Subscription;
  localUserEmailSubscription: Subscription;
  signedInUserEmail: string;
  infoToUser: string;
  infoToUserAdminOrNot: string;
  displayedName: string;


  constructor(private usersService: UsersService,
              private loginService: LoginService,
              private userAPILMTService: UserAPILMTService) { }

  ngOnInit() {

    this.usersSubscription = this.userAPILMTService.usersSubject.subscribe(
      (users: User[]) => {
        this.usersMatTable.data = users;
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
  this.usersMatTable.data.unshift(newUser);
  this.usersMatTable._updateChangeSubscription();
 }

  onEditButtonClick(user: User) {

    this.userToModify.set(user._links.self.href, this.cloneObject(user));
   user.isOnUpdate = true;
  }

  onDeleteButtonClick(user: User) {
    this.usersService.deleteUser(user);
    this.usersMatTable._updateChangeSubscription();
  }

  iniTializeData(user: User) {
    if (!user.isAdmin) {
      user.isAdmin = false;
    }
  }
  onSaveButtonClick(user: User) {
    // this.iniTializeData(user);
   // this.usersService.getUserByEmail(this.loginService.localUserEmail);
         user.isOnUpdate = false;
      if (user._links) {
        // this.usersService.updateUser(user);
        this.userAPILMTService.updateUser(user);
       // this.userToModify.delete(user.id);
      } else {
        this.userAPILMTService. createUserWithEmailAndPassword (user);
      }
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
