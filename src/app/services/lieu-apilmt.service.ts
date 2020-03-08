import { Injectable } from '@angular/core';
import {Lieu} from '../model/Lieu';
import {apiLMT} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LoadingService} from './loading-service.service';
import {AlertService} from './alert-service.service';
import {Subject} from 'rxjs';



@Injectable({
  providedIn: 'root'
})

export class LieuApilmtService {

  private lieuAPILMTUrl = `${apiLMT.url}/lieus`;
  lieux: Lieu[] = [];
  // lieu: Lieu;
  lieuxSubject = new Subject<Lieu[]>();
  // lieuSubject = new Subject<Lieu>();

  getAllLieux(): void {
    this.loadingService.hideLoading();
    this.lieux = null;
    this.http.get<any>(this.lieuAPILMTUrl).subscribe(
      next => {
        const lieux = next._embedded.lieus;
        if (lieux && lieux.length > 0) {
          this.lieux = next._embedded.lieus;
        }
        this.emitLieuxSubject();
      },
      error => {
        console.log(error);
        this.handleError(error);
      }
    );
  }

  emitLieuxSubject() {
    if (this.lieux) {
      this.lieuxSubject.next(Array.from(this.lieux));
    }
    this.loadingService.hideLoading();
  }

  addLieu(lieu: Lieu): void {
    this.loadingService.showLoading();
    this.http.post<Lieu>(this.lieuAPILMTUrl, lieu).subscribe(
      next => {
        this.lieux[this.lieux.indexOf(lieu)] = next;
        this.lieux.unshift(next);
        this.emitLieuxSubject();
      },
      error => {
        this.handleError(error);
      }
    );
  }

  handleError(error): void {
    this.loadingService.hideLoading();
    this.alertService.error(error.message);
  }
  constructor(private http: HttpClient,
              public loadingService: LoadingService,
              public alertService: AlertService) { }
}
