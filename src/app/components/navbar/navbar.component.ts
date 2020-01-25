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
    private authService: LoginService,
    ) { }

  ngOnInit() {
  }

 /* logout() {
    this.router.navigate(['/login']);

  }*/

  logoutuser() {
    this.authService.logoutuser();
     // this.router.navigate(['/login']);
    }

}
