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
  dons: Don[] = [];
  donsSubject = new Subject<Don[]>();
  handleError: any;


  constructor(private http: HttpClient,
    public loginService: LoginService,
    public loadingService: LoadingService,
    public alertService: AlertService) { }

    emitDonsSubject() {
      if (this.dons) {
        this.donsSubject.next(Array.from(this.dons));
      }
      this.loadingService.hideLoading();
    }


  getDon() {
    this.dons = null;
    this.http.get<Don[]>(this.donAPILMTUrl).subscribe(
      next => {
        const dons = next;
        if (next) {
          this.dons = dons;
        }
        this.emitDonsSubject();
      },
      error => {
        this.handleError(error);
      }
    );
  }
  delDon() {}



}
