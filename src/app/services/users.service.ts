import * as firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import {User} from '../model/User';
import {Subject} from 'rxjs';
import {error} from 'util';
import {AngularFirestore} from '@angular/fire/firestore';


// Add the Firebase services that you want to use
import 'firebase/auth';

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
  loggedUserEmail: string;

  constructor(public fs: AngularFirestore) {}

  getCurrentUserEmail(): string {
    this.loggedUserEmail = this.fs.firestore.app.auth().currentUser.email;
    return this.loggedUserEmail;
  }

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
      .then((value) => {

       // this.userAuthUid = value.user.uid;
       const userAuth = firebase.auth().currentUser;
        user.userId = value.user.uid;
           console.log('idTokenUtilisateur est :');
           console.log(user.userId);
        this.addUser(user);
       userAuth.updateProfile({
          displayName: user.prenom + ' ' + user.name
        });
        userAuth.sendEmailVerification().then(function() {

          console.log('email sent to ' + this.userAuth.email + '.');
        }).catch(function() {
          // An error happened.
        });
      });

   }



  private addUser(user: User): void {

    // this.createUserWithEmailAndPassword(user);
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
    //  user.userId = this.userAuthUid;

     this.fs.collection('Users').doc(user.userId).set(Object.assign({}, user));
     if (!this.usersMap.has(user.email)) {
       this.usersMap.set(user.email, user)
       this.users.unshift(user);
      }
  }

  updateUser(user: User): void {

    this.fs.collection('Users').doc(user.userId)
      .set(Object.assign({ name: user.name, email: user.email, prenom: user.prenom, password: user.password, isAdmin: user.isAdmin, urlPicture: user.urlPicture}));
    this.users[this.users.indexOf(user)] = user;
    this.emitUsersSubject();

  }

  getUserByEmail(email: string) {
    if (this.usersMap.has(email)) {
      this.userByEmail = this.usersMap.get(email);
      this.emitUserByEmailSubject();
    }
  }

  getAllUsers(): void {
    this.fs.collection('Users').get()
      .subscribe(usersDoc => {
          usersDoc.forEach(doc => {
            let user: User;
            user = <User>doc.data();
            if (!this.usersMap.has(user.email)) {
              this.usersMap.set(user.email, <User>doc.data());
              this.users.unshift(<User>doc.data());
            }
          });

          this.emitUsersSubject();
        },
        () => {
          console.log('Erreur' + error);
        });
    }

  deleteUser(user: User) {
    const email = this.fs.firestore.app.auth().currentUser.email;
    this.getUserByEmail(email);
    this.fs.collection('Users').doc(user.userId).delete();

    this.fs.firestore.app.auth().signInWithEmailAndPassword(user.email, user.password).then(userToDelete => {
      userToDelete.user.delete();
    });
    this.fs.firestore.app.auth().signInWithEmailAndPassword(this.userByEmail.email, this.userByEmail.password );
    this.users.splice( this.users.indexOf(user), 1);
    this.emitUsersSubject();
   }
}
