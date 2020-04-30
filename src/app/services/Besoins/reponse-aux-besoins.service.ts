import { Injectable } from '@angular/core';
import {apiLMT} from '../../../environments/environment';
import {Subject} from 'rxjs';
import {AlertService} from '../alert-service.service';
import {LoadingService} from '../loading-service.service';
import {HttpClient} from '@angular/common/http';
import {ReponseAuxBesoins} from '../../model/ReponseAuxBesoins';

@Injectable({
  providedIn: 'root'
})
export class ReponseAuxBesoinsService {

  private reponseAuxBesoinsAPILMTUrl = `${apiLMT.url}/reponseAuxBesoins`;
  reponseAuxBesoinsSubject = new Subject<ReponseAuxBesoins[]>();
  reponseAuxBesoins: ReponseAuxBesoins[] = [];

  constructor(private alertService: AlertService, private loadingService: LoadingService, private http: HttpClient) {
  }

  emitReponseAuxBesoinsSubject() {
    if (this.reponseAuxBesoinsSubject) {
      this.reponseAuxBesoinsSubject.next(this.reponseAuxBesoins);
    }
    this.loadingService.hideLoading();
  }

  getAllReponseAuxBesoins(): void {
    this.loadingService.showLoading();
    this.reponseAuxBesoins = null;
    this.http.get<any>(this.reponseAuxBesoinsAPILMTUrl).subscribe(
      next => {
        const reponseAuxBesoins = next;
        if (next) {
          this.reponseAuxBesoins = reponseAuxBesoins._embedded.reponseAuxBesoins;
        }
        console.log(this.reponseAuxBesoins);
        this.emitReponseAuxBesoinsSubject();
      },
      error => {
        this.handleError(error);
      }
    );

  }

  // Création du besoin reponseAuxBesoins
  addReponseAuxBesoins(reponseAuxBesoins: ReponseAuxBesoins): void {
    this.loadingService.showLoading();
    this.http.post<ReponseAuxBesoins>(this.reponseAuxBesoinsAPILMTUrl, reponseAuxBesoins).subscribe(
      next => {
        this.reponseAuxBesoins[this.reponseAuxBesoins.indexOf(reponseAuxBesoins)] = next;
        this.reponseAuxBesoins.unshift(next);
        this.emitReponseAuxBesoinsSubject();
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
