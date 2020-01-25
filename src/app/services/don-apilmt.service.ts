import { Injectable } from '@angular/core';
import { apiLMT } from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {LoginService} from './login.service';
import {AlertService} from './alert-service.service';
import {LoadingService} from './loading-service.service';
import {  } from 'firebase';
import { Subject } from 'rxjs';
import { User } from '../model/User';
import { Don } from '../model/don';

@Injectable({
  providedIn: 'root'
})
export class DonApilmtService {
  private donAPILMTUrl = `${apiLMT.url}/don`;
  users: User[] = [];
  usersSubject = new Subject<User[]>();
  userSubject = new Subject<User>();
  userByEmailSubject = new Subject<User>();
  user = new User();
  userByEmail: User;
  loggedUserEmail;
  dons: Don[] = [];
  donsSubject = new Subject<Don[]>();
  donSubject = new Subject<Don>();
  don = new Don();
  handleError: any;


  constructor(private http: HttpClient,
    public loginService: LoginService,
    public loadingService: LoadingService,
    public alertService: AlertService) { }

    emitUserSubject() {
                this.userSubject.next(this.user);
                this.loadingService.hideLoading();
              }

    emitDonsSubject() {
      this.donsSubject.next(this.dons);
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


  getDon() {
    this.loadingService.showLoading();
    this.http.get<any>(this.donAPILMTUrl).subscribe(
      next => {
        const dons = next._embedded.dons;
        if (dons && dons.length > 0) {
          this.dons = next._embedded.dons;
        }
        this.emitDonsSubject();
      },
      error => {
        console.log(error);
        this.handleError(error);
      }
    );
  }
  delDon() {}



}
