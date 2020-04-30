import { Component, OnInit } from '@angular/core';
import {Alimentaire} from '../../../model/Alimentaire';
import {Subscription} from 'rxjs';
import {MatTableDataSource} from '@angular/material';
import {AlimentaireService} from '../../../services/Besoins/alimentaire.service';

@Component({
  selector: 'app-alimentaire',
  templateUrl: './alimentaire.component.html',
  styleUrls: ['./alimentaire.component.scss']
})
export class AlimentaireComponent implements OnInit {

  displayedColumnsAlimentaires: string[] = ['Nom Alimentaire', 'Description', 'Actions'];
  alimentaire = new Alimentaire();
  alimentaires: Alimentaire[] = [];
  alimentairesSubscription: Subscription;
  alimentairesMatTable: MatTableDataSource<Alimentaire>  = new MatTableDataSource<Alimentaire>(this.alimentaires);
  alimentaireToModify = new Map<string, Alimentaire>();

  constructor(private alimentaireService: AlimentaireService) { }


  ngOnInit() {

    this.alimentairesSubscription = this.alimentaireService.alimentairesSubject.subscribe(
      (alimentaires: Alimentaire[]) => {
        this.alimentairesMatTable.data = alimentaires;
        this.alimentairesMatTable._updateChangeSubscription();
      }
    );
    this.alimentaireService.getAllAlimentaire();
  }

  onCreateNewAlimentairesClick() {
    const newAlimentaire = new Alimentaire();
    newAlimentaire.isOnUpdate = true;
    this.alimentairesMatTable.data.unshift(newAlimentaire);
    this.alimentairesMatTable._updateChangeSubscription();
  }

  onSaveButtonClick(alimentaire: Alimentaire) {
    alimentaire.isOnUpdate = false;
    if (!alimentaire._links) {
      this.alimentaireService.addAlimentaire(alimentaire);
    } else {
      this.alimentaireService.updateAlimentaire(alimentaire);
      this.alimentaireToModify.delete(alimentaire._links.self.href);
    }
  }

  onEditButtonClick(alimentaire: Alimentaire) {
    this.alimentaireToModify.set(alimentaire._links.self.href, this.cloneObject(alimentaire));
    alimentaire.isOnUpdate = true;

  }

  onDeleteButtonClick(alimentaire: Alimentaire) {
    if (alimentaire._links) {
      this.alimentaireService.deleteAlimentaire(alimentaire);
      this.alimentairesMatTable._updateChangeSubscription();
    }
  }

  onCancelButtonClick(alimentaire: Alimentaire) {
    alimentaire.isOnUpdate = false;
    if (alimentaire._links.self.href) {
      this.copieObject(this.alimentaireToModify.get(alimentaire._links.self.href), alimentaire);
      this.alimentaireToModify.delete(alimentaire._links.self.href);
    } else {
      this.alimentairesMatTable.data.splice(this.alimentairesMatTable.data.indexOf(alimentaire), 1);
    }
    this.alimentairesMatTable._updateChangeSubscription();
  }


  cloneObject(src): Alimentaire {
    const target = new Alimentaire();
    for (const prop in src) {
      if (src.hasOwnProperty(prop)) {
        target[prop] = src[prop];
      }
    }
    return target;
  }

  copieObject(src: Alimentaire, target: Alimentaire): Alimentaire {
    for (const prop in src) {
      if (src.hasOwnProperty(prop)) {
        target[prop] = src[prop];
      }
    }
    return target;
  }
}
