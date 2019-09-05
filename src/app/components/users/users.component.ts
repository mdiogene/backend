import { Component, OnInit, OnDestroy } from '@angular/core';
import {User} from '../../model/User';
import {Subscription} from 'rxjs';
import {UsersService} from '../../services/users.service';
import {MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';
import {LoginService} from '../../services/login.service';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {


  userToModify = new Map<number, User>();
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


  constructor(private usersService: UsersService, private loginService: LoginService, private router: Router) { }

  ngOnInit() {

    this.usersSubscription = this.usersService.usersSubject.subscribe(
      (users: User[]) => {
        this.usersMatTable.data = users;
        this.usersMatTable._updateChangeSubscription();
        console.log('je suis dans onInit users : ');
        console.log(this.usersMatTable.data );
      }
    );

    this.userByEmailSubscription = this.usersService.userByEmailSubject.subscribe(
      (user: User) => {
        this.userByEmail = user;
      }
    );
1
    this.localUserEmailSubscription = this.loginService.localUserEmailSubject.subscribe(
      (email: string) => {
        console.log('localUserEmailSubscription email est:' );

        this.signedInUserEmail = email;
        console.log( this.signedInUserEmail );
      }
    );

    this.usersService.getAllUsers();

    this.getDisplayedNames();
  }

  getDisplayedNames() {
    if (this.usersService.getCurrentUserEmail()) {
      this.usersService.getUserByEmail(this.usersService.getCurrentUserEmail());
      this.displayedName = 'Logged user : ' + this.userByEmail.prenom + ' ' + this.userByEmail.name;
    } else {
      this.displayedName  = '';
    }
    console.log('logged user email:');
    console.log(this.signedInUserEmail);
    console.log('logged user :');
    console.log(this.userByEmail);
  //  return this.displayedName;

  }
  onCreateNewUsersClick(): void {
  const newUser = new User();
  newUser.isOnUpdate = true;
  this.usersMatTable.data.unshift(newUser);
  this.usersMatTable._updateChangeSubscription();
 }

  onEditButtonClick(user: User) {
    console.log(user);
    this.userToModify.set(user.id, this.cloneObject(user));
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
    this.iniTializeData(user);
    this.loginService.localUserEmail;
    this.usersService.getUserByEmail(this.loginService.localUserEmail);
         user.isOnUpdate = false;
      if (user.id) {
        this.usersService.updateUser(user);
        this.userToModify.delete(user.id);
      } else {
        this.usersService. createUserWithEmailAndPassword (user);
      }
   }

  onCancelButtonClick(user: User) {
    user.isOnUpdate = false;
    if (user.id) {
      this.copieObject(this.userToModify.get(user.id), user);
      this.userToModify.delete(user.id);
      console.log(user);
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
