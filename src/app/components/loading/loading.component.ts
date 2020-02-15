import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {LoadingService} from '../../services/loading-service.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit, OnDestroy {


  private subscription: Subscription;

  showLoading: boolean;

  constructor(private loadingService: LoadingService) { }

  ngOnInit() {
    this.subscription = this.loadingService.subject.subscribe(
      showLoading => {
        this.showLoading = showLoading;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
