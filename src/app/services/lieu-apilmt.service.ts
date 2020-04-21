import { Injectable } from '@angular/core';
import {Lieu} from '../model/Lieu';
import {apiLMT} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {LoadingService} from './loading-service.service';
import {AlertService} from './alert-service.service';
import {Subject} from 'rxjs';
import {DialogConfirmationDialogComponent} from '../components/dialog-confirmation-dialog/dialog-confirmation-dialog.component';
import {MatDialog} from '@angular/material';

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

  deleteLieu(lieu: Lieu) {
    this.loadingService.showLoading();
    if (lieu._links) {
      const urlHref = this.getUrlForUpdateAndDelete(lieu._links.self.href, 'lieus', `${apiLMT.url}`);

      this.http.delete<Lieu>(urlHref).subscribe(
        next => {
          const info = 'Lieu a été suprimé';
          this.openDialog(info);

          this.lieux.splice(this.lieux.indexOf(lieu), 1);
          this.emitLieuxSubject();
        },
        error => {
          this.handleError(error);
        }
      );
    }

  }

  updateLieu(lieu: Lieu): void {
    this.loadingService.showLoading();
    if (lieu._links) {
      const urlHref = this.getUrlForUpdateAndDelete(lieu._links.self.href, 'lieus', `${apiLMT.url}`);
      this.http.put<Lieu>(urlHref, lieu).subscribe(
        next => {
        this.lieux[this.lieux.indexOf(lieu)] = next;
          this.emitLieuxSubject();
        },
        error => {
          this.handleError(error);
        }
      );
    }
  }

  getUrlForUpdateAndDelete(url: string, objectToAdd: string, urlToAdd: string): string {
    const urlObject = url.substring(url.indexOf(objectToAdd), url.length );
    const vraiUrl = urlToAdd + '/' + urlObject;
    return vraiUrl;
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

  constructor(private http: HttpClient,
              public loadingService: LoadingService,
              public alertService: AlertService,
              private dialog: MatDialog) { }


}
