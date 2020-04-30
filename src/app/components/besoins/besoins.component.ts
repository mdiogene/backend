import { Component, OnInit } from '@angular/core';
import {TypeBesoin} from '../../model/TypeBesoin';
import {BesoinsRemontes} from '../../model/BesoinsRemontes';
import {Vetement} from '../../model/Vetement';
import {Services} from '../../model/Service';
import {MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';
import {BesoinsRemontéService} from '../../services/Besoins/besoins-remonté.service';
import {Alimentaire} from '../../model/Alimentaire';
import {ServiceService} from '../../services/Besoins/service.service';
import {AlimentaireService} from '../../services/Besoins/alimentaire.service';
import {TypeBesoinsService} from '../../services/Besoins/type-besoins.service';
import {VetementsService} from '../../services/Besoins/vetements.service';

@Component({
  selector: 'app-besoins',
  templateUrl: './besoins.component.html',
  styleUrls: ['./besoins.component.scss']
})
export class BesoinsComponent implements OnInit {
  typeBesoinsRemontesList: TypeBesoin[] = [];
  serviceList: Services[];
 // service = new Services();
  // alimentaire = new Alimentaire();
  displayedColumnsBesoinsRemontes: string[] = ['Type besoin', 'Besoin', 'Quantité', 'Date de Création', 'Description', 'Actions'];
  besoin = new BesoinsRemontes();
  besoins: BesoinsRemontes[] = [];
  alimentaires: Alimentaire[] = [];
  vetementsSubscription: Subscription;
  vetements: Vetement[] = [];
  besoinsSubscription: Subscription;
  besoinsMatTable: MatTableDataSource<BesoinsRemontes>  = new MatTableDataSource<BesoinsRemontes>(this.besoins);
  besoinToModify = new Map<string, BesoinsRemontes>();
  serviceSubscription: Subscription;
  alimentairesSubject: Subscription;
  typeBesoinsSubscription: Subscription;

  constructor(private besoinService: BesoinsRemontéService,
              private serviceService: ServiceService,
              private typeBesoinsService: TypeBesoinsService,
              private vetementsService: VetementsService,
              private alimentaireService: AlimentaireService) { }


  ngOnInit() {

    this.besoinsSubscription = this.besoinService.besoinsRemontesSubject.subscribe(
      (besoins: BesoinsRemontes[]) => {
        this.besoinsMatTable.data = besoins;
        this.besoinsMatTable._updateChangeSubscription();
      }
    );

    this.typeBesoinsSubscription = this.typeBesoinsService.typebesoinSubject.subscribe(
      (typeBesoins: TypeBesoin[]) => {
       this.typeBesoinsRemontesList = typeBesoins;
        this.besoinsMatTable._updateChangeSubscription();
      }
    );

    this.serviceSubscription = this.serviceService.servicesSubject.subscribe(
      (services: Services[]) => {
        this.serviceList = services;
        this.besoinsMatTable._updateChangeSubscription();
      }
    );

    this.alimentairesSubject = this.alimentaireService.alimentairesSubject.subscribe(
      (alimentaires: Alimentaire[]) => {
        this.alimentaires = alimentaires;
        this.besoinsMatTable._updateChangeSubscription();
      }
    );

    this.vetementsSubscription = this.vetementsService.vetementsSubject.subscribe(
      (vetements: Vetement[]) => {
        this.vetements = vetements;
        this.besoinsMatTable._updateChangeSubscription();
      }
    );

    this.vetementsService.getAllVetements();
    this.typeBesoinsService.getAllTypeBesoin();
    this.serviceService.getAllServices();
    this.alimentaireService.getAllAlimentaire();
    this.besoinService.getAllBesoinsRemontes();
  }

  onCreateNewBesoinsRemontesClick() {
    const newBesoin = new BesoinsRemontes();
    newBesoin.isOnUpdate = true;
    this.besoinsMatTable.data.unshift(newBesoin);
    this.besoinsMatTable._updateChangeSubscription();
  }

  onSaveButtonClick(besoin: BesoinsRemontes) {
    if (besoin._links) {
      this.besoinService.updateBesoinsRemonte(besoin);
    } else {
      console.log(besoin);
      this.besoinService.addBesoinsRemonte(besoin);

    }
    besoin.isOnUpdate = false;
  }

  onEditButtonClick(besoin: BesoinsRemontes) {
    this.besoinToModify.set(besoin._links.self.href, this.cloneObject(besoin));
    besoin.isOnUpdate = true;

  }

  onDeleteButtonClick(besoin: BesoinsRemontes) {
    if (besoin._links) {
      this.besoinService.deleteBesoinsRemonte(besoin);
      this.besoinsMatTable._updateChangeSubscription();
    }
  }

  onCancelButtonClick(besoin: BesoinsRemontes) {
    besoin.isOnUpdate = false;
    if (besoin._links.self.href) {
      this.copieObject(this.besoinToModify.get(besoin._links.self.href), besoin);
      this.besoinToModify.delete(besoin._links.self.href);
    } else {
      this.besoinsMatTable.data.splice(this.besoinsMatTable.data.indexOf(besoin), 1);
    }
    this.besoinsMatTable._updateChangeSubscription();
  }


  cloneObject(src): BesoinsRemontes {
    const target = new BesoinsRemontes();
    for (const prop in src) {
      if (src.hasOwnProperty(prop)) {
        target[prop] = src[prop];
      }
    }
    return target;
  }

  copieObject(src: BesoinsRemontes, target: BesoinsRemontes): BesoinsRemontes {
    for (const prop in src) {
      if (src.hasOwnProperty(prop)) {
        target[prop] = src[prop];
      }
    }
    return target;
  }
}
