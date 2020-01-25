import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoginService} from './services/login.service';

import {Subscription} from 'rxjs';
import {UsersService} from './services/users.service';
import {User} from './model/User';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ProjetMaster';
  userLoggedIn: boolean;
  userLoggedInSubscrition: Subscription;

  constructor(private authService: LoginService, private usersService: UsersService, private router: Router) {}

  ngOnInit(): void {
    this.userLoggedInSubscrition = this.authService.userLoggedInSubject.subscribe(userLoggedIn => {
      this.userLoggedIn = userLoggedIn;
    });
  }

  ngOnDestroy(): void {
    this.userLoggedInSubscrition.unsubscribe();
  }

  logoutUser() {
    this.authService.afterLogout();

    this.router.navigate(['/']);
  }
}