import { Injectable } from '@angular/core';
import {apiLMT} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Maraude} from '../model/Maraude';
import {Subject} from 'rxjs';
import {AlertService} from './alert-service.service';
import {User} from '../model/User';
import {LoadingService} from './loading-service.service';
import {DialogConfirmationDialogComponent} from '../components/dialog-confirmation-dialog/dialog-confirmation-dialog.component';
import {MatDialog} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class MaraudeApilmtService {
  private maraudeAPILMTUrl = `${apiLMT.url}/maraudes`;
  maraudesSubject = new Subject<Maraude[]>();
  maraudes: Maraude[] = [];

  constructor(private alertService: AlertService,
              private loadingService: LoadingService,
              private http: HttpClient,
              private dialog: MatDialog) { }

  emitMaraudesSubject() {
    if (this.maraudes) {
      this.maraudesSubject.next(Array.from(this.maraudes));
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
        // console.log(this.maraudes);
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
        this.maraudes[this.maraudes.indexOf(maraude)] = next;
        this.maraudes.unshift(next);
        const info = 'Maraude crée';
        this.openDialog(info);
        this.emitMaraudesSubject();
      },
      error => {
        const info = 'Maraude pas crée réessayer';
        this.handleError(error);
        this.openDialog(info);
      }
    );
  }

  openDialog(information: string): void {
    const dialogRef = this.dialog.open(DialogConfirmationDialogComponent, {
      width: '400px',
      data: {information: information}
    });
  }

  handleError(error): void {
    this.loadingService.hideLoading();
    this.alertService.error(error.message);
  }

  getUrlForUpdateAndDelete(url: string, objectToAdd: string, urlToAdd: string): string {
    const urlObject = url.substring(url.indexOf(objectToAdd), url.length );
    const vraiUrl = urlToAdd + '/' + urlObject;
    return vraiUrl;
  }

  updateMaraude(maraude: Maraude): void {
    console.log(maraude);
    this.loadingService.showLoading();
    if (maraude._links) {
      const urlHref = this.getUrlForUpdateAndDelete(maraude._links.self.href, 'maraudes', `${apiLMT.url}`);

      this.http.put<Maraude>(urlHref, maraude).subscribe(
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
