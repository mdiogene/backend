import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {MatTableDataSource} from '@angular/material';
import {Services} from '../../../model/Service';
import {ServiceService} from '../../../services/Besoins/service.service';


@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  displayedColumnsServices: string[] = ['Nom Services', 'Description', 'Actions'];
  service = new Services();
  services: Services[] = [];
  servicesSubscription: Subscription;
  servicesMatTable: MatTableDataSource<Services>  = new MatTableDataSource<Services>(this.services);
  serviceToModify = new Map<string, Services>();

  constructor(private serviceServices: ServiceService) { }


  ngOnInit() {

    this.servicesSubscription = this.serviceServices.servicesSubject.subscribe(
      (services: Services[]) => {
        this.servicesMatTable.data = services;
        this.servicesMatTable._updateChangeSubscription();
      }
    );
    this.serviceServices.getAllServices();
  }

  onCreateNewServicesClick() {
    const newServices = new Services();
    newServices.isOnUpdate = true;
    this.servicesMatTable.data.unshift(newServices);
    this.servicesMatTable._updateChangeSubscription();
  }

  onSaveButtonClick(service: Services) {
    service.isOnUpdate = false;
    if (!service._links) {
      this.serviceServices.addServices(service);
    } else {
      this.serviceServices.updateServices(service);
      this.serviceToModify.delete(service._links.self.href);
    }
  }

  onEditButtonClick(service: Services) {
    this.serviceToModify.set(service._links.self.href, this.cloneObject(service));
    service.isOnUpdate = true;

  }

  onDeleteButtonClick(service: Services) {
    if (service._links) {
      this.serviceServices.deleteServices(service);
      this.servicesMatTable._updateChangeSubscription();
    }
  }

  onCancelButtonClick(service: Services) {
    service.isOnUpdate = false;
    if (service._links.self.href) {
      this.copieObject(this.serviceToModify.get(service._links.self.href), service);
      this.serviceToModify.delete(service._links.self.href);
    } else {
      this.servicesMatTable.data.splice(this.servicesMatTable.data.indexOf(service), 1);
    }
    this.servicesMatTable._updateChangeSubscription();
  }


  cloneObject(src): Services {
    const target = new Services();
    for (const prop in src) {
      if (src.hasOwnProperty(prop)) {
        target[prop] = src[prop];
      }
    }
    return target;
  }

  copieObject(src: Services, target: Services): Services {
    for (const prop in src) {
      if (src.hasOwnProperty(prop)) {
        target[prop] = src[prop];
      }
    }
    return target;
  }

}
