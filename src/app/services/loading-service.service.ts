import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {NavigationStart, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  subject = new Subject<any>();

  /** Indicate if we keep the alert after navigation change. It's always false */
  private keepAfterNavigationChange = false;

  private _showLoading = false;

  /** Constructor */
  constructor(private router: Router) {
    // clear alert message on route change
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterNavigationChange) {
          // only keep for a single location change
          this.keepAfterNavigationChange = false;
        } else {
          this.emitSubject();
        }
      }
    });
  }

  private emitSubject() {
    this.subject.next(this._showLoading);
  }

  showLoading() {
    this._showLoading = true;
    this.emitSubject();
  }

  hideLoading() {
    this._showLoading = false;
    this.emitSubject();
  }
}
