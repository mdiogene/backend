import { Injectable } from '@angular/core';
import {apiLMT} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Maraude} from '../model/Maraude';
import {Subject} from 'rxjs';
import {AlertService} from './alert-service.service';
import {User} from '../model/User';
import {LoadingService} from './loading-service.service';

@Injectable({
  providedIn: 'root'
})
export class MaraudeApilmtService {
  private maraudeAPILMTUrl = `${apiLMT.url}/maraudes`;
  maraudesSubject = new Subject<Maraude[]>();
  maraudes: Maraude[] = [];

  constructor(private alertService: AlertService, private loadingService: LoadingService, private http: HttpClient) { }

  emitMaraudesSubject() {
    if (this.maraudes) {
      this.maraudesSubject.next(this.maraudes);
    }
    this.loadingService.hideLoading();
  }

  getAllMaraudes(): void {
    this.loadingService.showLoading();
    this.maraudes = null;
    this.http.get<any>(this.maraudeAPILMTUrl).subscribe(
      next => {
        const maraudes = next;
        if (next) {
          this.maraudes = maraudes._embedded.maraudes;
        }
        console.log(this.maraudes);
        this.emitMaraudesSubject();
      },
      error => {
        this.handleError(error);
      }
    );

  }

  // Création de la Maraude
  addMaraude(maraude: Maraude): void {
    this.loadingService.showLoading();
    this.http.post<Maraude>(this.maraudeAPILMTUrl, maraude).subscribe(
      next => {
        this.maraudes.unshift(next);
        this.emitMaraudesSubject();
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

  updateMaraude(maraude: Maraude): void {
    console.log(maraude);
    this.loadingService.showLoading();
    if (maraude._links) {
      this.http.put<Maraude>(maraude._links.self.href, maraude).subscribe(
        next => {
          this.maraudes[this.maraudes.indexOf(maraude)] = next;
          this.emitMaraudesSubject();
        },
        error => {
          this.handleError(error);
        }
      );
    }
  }
}
