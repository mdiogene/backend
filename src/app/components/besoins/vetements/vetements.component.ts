import { Component, OnInit } from '@angular/core';
import {Vetement} from '../../../model/Vetement';
import {Subscription} from 'rxjs';
import {MatTableDataSource} from '@angular/material';
import {VetementsService} from '../../../services/Besoins/vetements.service';

@Component({
  selector: 'app-vetements',
  templateUrl: './vetements.component.html',
  styleUrls: ['./vetements.component.scss']
})
export class VetementsComponent implements OnInit {
  userLoggedIn: true;
  displayedColumnsVetements: string[] = ['Type Vêtement', 'Description', 'Actions'];
  vetement = new Vetement();
  vetements: Vetement[] = [];
  vetementsSubscription: Subscription;
  vetementsMatTable: MatTableDataSource<Vetement>  = new MatTableDataSource<Vetement>(this.vetements);
  vetementToModify = new Map<string, Vetement>();

  constructor(private vetementAPILMTService: VetementsService) { }


  ngOnInit() {

    this.vetementsSubscription = this.vetementAPILMTService.vetementsSubject.subscribe(
      (vetements: Vetement[]) => {
        this.vetementsMatTable.data = vetements;
        this.vetementsMatTable._updateChangeSubscription();
      }
    );
    this.vetementAPILMTService.getAllVetements();
  }

  onCreateNewVetementsClick() {
    const newVetement = new Vetement();
    newVetement.isOnUpdate = true;
    this.vetementsMatTable.data.unshift(newVetement);
    this.vetementsMatTable._updateChangeSubscription();
  }

  onSaveButtonClick(vetement: Vetement) {
    vetement.isOnUpdate = false;
    if (!vetement._links) {
      this.vetementAPILMTService.addVetement(vetement);
    } else {
      this.vetementAPILMTService.updateVetement(vetement);
      this.vetementToModify.delete(vetement._links.self.href);
    }
  }

  onEditButtonClick(vetement: Vetement) {
    this.vetementToModify.set(vetement._links.self.href, this.cloneObject(vetement));
    vetement.isOnUpdate = true;

  }

  onDeleteButtonClick(vetement: Vetement) {
    if (vetement._links) {
      this.vetementAPILMTService.deleteVetement(vetement);
      this.vetementsMatTable._updateChangeSubscription();
    }
  }

  onCancelButtonClick(vetement: Vetement) {
    vetement.isOnUpdate = false;
    if (vetement._links.self.href) {
      this.copieObject(this.vetementToModify.get(vetement._links.self.href), vetement);
      this.vetementToModify.delete(vetement._links.self.href);
    } else {
      this.vetementsMatTable.data.splice(this.vetementsMatTable.data.indexOf(vetement), 1);
    }
    this.vetementsMatTable._updateChangeSubscription();
  }


  cloneObject(src): Vetement {
    const target = new Vetement();
    for (const prop in src) {
      if (src.hasOwnProperty(prop)) {
        target[prop] = src[prop];
      }
    }
    return target;
  }

  copieObject(src: Vetement, target: Vetement): Vetement {
    for (const prop in src) {
      if (src.hasOwnProperty(prop)) {
        target[prop] = src[prop];
      }
    }
    return target;
  }
}
