import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Alimentaire} from '../../model/Alimentaire';
import {apiLMT} from '../../../environments/environment';
import {AlertService} from '../alert-service.service';
import {LoadingService} from '../loading-service.service';

@Injectable({
  providedIn: 'root'
})
export class AlimentaireService {

  private alimentaireAPILMTUrl = `${apiLMT.url}/alimentaires`;
  alimentaireSubject = new Subject<Alimentaire>();
  alimentaires: Alimentaire[] = [];
  alimentaire: Alimentaire;
  alimentairesSubject = new Subject<Alimentaire[]>();

  constructor(private alertService: AlertService, private loadingService: LoadingService, private http: HttpClient) {}

  emitAlimentairesSubject() {
    if (this.alimentaires) {
      this.alimentairesSubject.next(this.alimentaires);
    }
    this.loadingService.hideLoading();
  }
  emitAlimentaireSubject() {
    if (this.alimentaireSubject) {
      this.alimentaireSubject.next(this.alimentaire);
    }
    this.loadingService.hideLoading();
  }

  getAllAlimentaire(): void {
    this.loadingService.showLoading();
    this.alimentaire = null;
    this.http.get<any>(this.alimentaireAPILMTUrl).subscribe(
      next => {
        const alimentaires = next;
        if (next) {
          this.alimentaires = alimentaires._embedded.alimentaires;
        }
        console.log(this.alimentaire);
        this.emitAlimentairesSubject();
      },
      error => {
        this.handleError(error);
      }
    );

  }

  // Création du besoin alimentaire
  addAlimentaire(alimentaire: Alimentaire): void {
    this.loadingService.showLoading();
    this.http.post<Alimentaire>(this.alimentaireAPILMTUrl, alimentaire).subscribe(
      next => {
        this.alimentaires[this.alimentaires.indexOf(alimentaire)] = next;
        this.alimentaires.unshift(next);
        this.emitAlimentairesSubject();
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

  updateAlimentaire(alimentaire: Alimentaire) {

  }

  deleteAlimentaire(alimentaire: Alimentaire) {

  }
}
