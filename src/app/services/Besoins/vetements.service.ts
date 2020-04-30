import { Injectable } from '@angular/core';
import {Vetement} from '../../model/Vetement';
import {apiLMT} from '../../../environments/environment';
import {Subject} from 'rxjs';
import {AlertService} from '../alert-service.service';
import {LoadingService} from '../loading-service.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VetementsService {

  private vetementsAPILMTUrl = `${apiLMT.url}/vetementses`;
  vetementsSubject = new Subject<Vetement[]>();
  vetements: Vetement[] = [];
  vetement: Vetement;
  private vetementSubject = new Subject<Vetement>();

  constructor(private alertService: AlertService, private loadingService: LoadingService, private http: HttpClient) {}

  emitVetementsSubject() {
    if (this.vetements) {
      this.vetementsSubject.next(Array.from(this.vetements));
    }
    this.loadingService.hideLoading();
  }

  emitVetementSubject() {
    if (this.vetement) {
      this.vetementSubject.next(this.vetement);
    }
    this.loadingService.hideLoading();
  }


  getAllVetements(): void {
    this.loadingService.showLoading();
    this.vetements = null;
    this.http.get<any>(this.vetementsAPILMTUrl).subscribe(
      next => {
        const vetements = next;
        if (next) {
          this.vetements = vetements._embedded.vetementses;
        }
        console.log(this.vetements);
        this.emitVetementsSubject();
      },
      error => {
        this.handleError(error);
      }
    );

  }

  // Création du besoin vetements
  addVetement(vetement: Vetement): void {
    this.loadingService.showLoading();
    this.http.post<Vetement>(this.vetementsAPILMTUrl, vetement).subscribe(
      next => {
        this.vetements[this.vetements.indexOf(vetement)] = next;
        // this.vetements.unshift(next);
        this.emitVetementSubject();
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

  updateVetement(vetement: Vetement) {
    
  }

  deleteVetement(vetement: Vetement) {
    
  }
}
