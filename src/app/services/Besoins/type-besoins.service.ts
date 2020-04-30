import { Injectable } from '@angular/core';
import {TypeBesoin} from '../../model/TypeBesoin';
import {apiLMT} from '../../../environments/environment';
import {Subject} from 'rxjs';
import {AlertService} from '../alert-service.service';
import {LoadingService} from '../loading-service.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TypeBesoinsService {
  private typebesoinAPILMTUrl = `${apiLMT.url}/typeBesoins`;
  typebesoinSubject = new Subject<TypeBesoin[]>();
  typebesoins: TypeBesoin[] = [];
  constructor(private alertService: AlertService, private loadingService: LoadingService, private http: HttpClient) {}

  emitTypeBesoinsSubject() {
    if (this.typebesoinSubject) {
      this.typebesoinSubject.next(this.typebesoins);
    }
    this.loadingService.hideLoading();
  }

  getAllTypeBesoin(): void {
    this.loadingService.showLoading();
    this.typebesoins = null;
    this.http.get<any>(this.typebesoinAPILMTUrl).subscribe(
      next => {
        const typebesoins = next;
        if (next) {
          this.typebesoins = typebesoins._embedded.typeBesoins;
        }
        console.log(this.typebesoins);
        this.emitTypeBesoinsSubject();
      },
      error => {
        this.handleError(error);
      }
    );

  }

  // Création des Type de Besoin
  addTypeBesoin(typebesoin: TypeBesoin): void {
    this.loadingService.showLoading();
    this.http.post<TypeBesoin>(this.typebesoinAPILMTUrl, typebesoin).subscribe(
      next => {
        this.typebesoins[this.typebesoins.indexOf(typebesoin)] = next;
        // this.typebesoins.unshift(next);
        this.emitTypeBesoinsSubject();
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

  updateTypeBesoin(typeBesoin: TypeBesoin) {

  }

  deleteTypeBesoin(typeBesoin: TypeBesoin) {

  }
}
