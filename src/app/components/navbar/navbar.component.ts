import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {LoginService} from '../../services/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public router: Router,
    private authService: LoginService
    ) { }

  ngOnInit() {
  }
  logoutUser() {
    this.authService.afterLogout();
    // localStorage.removeItem('userLoggedIn');
    // this.router.navigate(['/']);
  }

}
