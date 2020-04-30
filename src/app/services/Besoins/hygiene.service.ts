import { Injectable } from '@angular/core';
import {apiLMT} from '../../../environments/environment';
import {Subject} from 'rxjs';
import {Hygiene} from '../../model/Hygiene';
import {AlertService} from '../alert-service.service';
import {LoadingService} from '../loading-service.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HygieneService {

  private hygienesAPILMTUrl = `${apiLMT.url}/hygienes`;
  hygienesSubject = new Subject<Hygiene[]>();
  hygienes: Hygiene[] = [];
  hygieneSubject = new Subject<Hygiene>();
  hygiene: Hygiene;

  constructor(private alertService: AlertService, private loadingService: LoadingService, private http: HttpClient) {
  }

  emitHygienesSubject() {
    if (this.hygienesSubject) {
      this.hygienesSubject.next(this.hygienes);
    }
    this.loadingService.hideLoading();
  }

  getAllHygienes(): void {
    this.loadingService.showLoading();
    this.hygienes = null;
    this.http.get<any>(this.hygienesAPILMTUrl).subscribe(
      next => {
        const hygienes = next;
        if (next) {
          this.hygienes = hygienes._embedded.hygienes;
        }
        console.log(this.hygienes);
        this.emitHygienesSubject();
      },
      error => {
        this.handleError(error);
      }
    );

  }

  // Création du besoin hygienes
  addHygienes(hygiene: Hygiene): void {
    this.loadingService.showLoading();
    this.http.post<Hygiene>(this.hygienesAPILMTUrl, hygiene).subscribe(
      next => {
        this.hygienes[this.hygienes.indexOf(hygiene)] = next;
        this.hygienes.unshift(next);
        this.emitHygienesSubject();
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
}
