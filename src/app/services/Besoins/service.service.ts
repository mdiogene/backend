import { Injectable } from '@angular/core';
import {Services} from '../../model/Service';
import {apiLMT} from '../../../environments/environment';
import {Subject} from 'rxjs';
import {AlertService} from '../alert-service.service';
import {LoadingService} from '../loading-service.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private servicesAPILMTUrl = `${apiLMT.url}/services`;
  servicesSubject = new Subject<Services[]>();
  services: Services[] = [];
  service: Services;
  private serviceSubject = new Subject<Services>();

  constructor(private alertService: AlertService, private loadingService: LoadingService, private http: HttpClient) {}

  emitServicesSubject() {
    if (this.servicesSubject) {
      this.servicesSubject.next(this.services);
    }
    this.loadingService.hideLoading();
  }

  emitServiceSubject() {
    if (this.service) {
      this.serviceSubject.next(this.service);
    }
    this.loadingService.hideLoading();
  }

  getAllServices(): void {
    this.loadingService.showLoading();
    this.services = null;
    this.http.get<any>(this.servicesAPILMTUrl).subscribe(
      next => {
        const services = next;
        if (next) {
          this.services = services._embedded.services;
        }
        console.log(this.services);
        this.emitServicesSubject();
      },
      error => {
        this.handleError(error);
      }
    );

  }

  // Création du besoin services
  addServices(service: Services): void {
    this.loadingService.showLoading();
    this.http.post<Services>(this.servicesAPILMTUrl, service).subscribe(
      next => {
        this.services[this.services.indexOf(service)] = next;
        this.services.unshift(next);
        this.emitServiceSubject();
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

  deleteService(service: Services) {
    
  }

  deleteServices(service: Services) {
    
  }

  updateServices(service: Services) {
    
  }
}
