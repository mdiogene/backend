import { Injectable } from '@angular/core';
import {User} from '../model/User';
import {Subject} from 'rxjs';
import {error} from 'util';
import {AngularFirestore} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

// Add the Firebase services that you want to use
import 'firebase/auth';
import {LoginService} from './login.service';



@Injectable({
  providedIn: 'root'
})
export class UsersService {
  users: User[] = [];
  usersSubject = new Subject<User[]>();
  userByEmailSubject = new Subject<User>();
  user = new User();
  id: number;
  usersMap: Map<string, User> = new Map();
  userRegistered: boolean;
  userByEmail: User;
currentUserEmail: string;

  constructor(public fs: AngularFirestore, loginService: LoginService) { }

  emitUsersSubject() {
    if (this.users) {
      this.usersSubject.next(Array.from(this.users));
    }
  }

  emitUserByEmailSubject() {
    if (this.userByEmail) {
      this.userByEmailSubject.next(this.userByEmail);
    }
  }

   createUserWithEmailAndPassword (user: User) {
    this.userRegistered = false;
    this.fs.firestore.app.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(function () {

        const userAuth = firebase.auth().currentUser;
        userAuth.updateProfile({
          displayName: user.prenom + ' ' + user.name
        })

        userAuth.sendEmailVerification().then(function() {

          console.log('email sent to ' + this.userAuth.email + '.');
        }).catch(function() {
          // An error happened.
        });
      });
  }



  addUser(user: User): void {
    this.id = 0;
    user.id = 0;
    console.log('au debut users a la valeur de :');
    console.log(user);

    if (this.users) {
      for (const userForId of this.users) {
        if (userForId && userForId.id > this.id) {
          this.id = userForId.id;
        }
      }
      user.id = this.id + 1;
    }

    this.createUserWithEmailAndPassword(user);
     this.fs.collection('Users').doc(user.email).set(Object.assign({}, user));
     if (!this.usersMap.has(user.email)) {
       this.usersMap.set(user.email, user)
       this.users.unshift(user);
      }
  }

  updateUser(user: User): void {

    this.fs.collection('Users').doc(user.email)
      .set(Object.assign({ id: user.id, name: user.name, email: user.email, prenom: user.prenom, password: user.password, isAdmin: user.isAdmin, urlPicture: user.urlPicture}));
    this.users[this.users.indexOf(user)] = user;
    this.emitUsersSubject();

  }

  getUserByEmail(email: string) {
    if (this.usersMap.has(email)) {
      this.userByEmail = this.usersMap.get(email);
      this.emitUserByEmailSubject();
      console.log('je suis dans getUserByEmail : l utilisateur admin est :' );
      console.log( email );
      console.log( this.userByEmail );

    }
  }

  getAllUsers(): void {
    this.fs.collection('Users').get()
      .subscribe(usersDoc => {
          usersDoc.forEach(doc => {
            if (!this.usersMap.has(doc.id)) {
              this.usersMap.set(doc.id, <User>doc.data())
              this.users.unshift(<User>doc.data());
            }
          });

          this.emitUsersSubject();
        },
        () => {
          console.log('Erreur de suppression' + error);
        });
    console.log('Le print de users map est:' );
    console.log( this.usersMap );

  }

  deleteUser(user: User) {
    this.fs.collection('Users').doc(user.email).delete();
    this.fs.firestore.app.auth().currentUser.delete();
    this.users.splice( this.users.indexOf(user), 1);
    this.emitUsersSubject();
   }
}
