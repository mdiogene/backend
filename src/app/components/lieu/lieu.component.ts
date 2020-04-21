import { Component, OnInit } from '@angular/core';
import {Lieu} from '../../model/Lieu';
import {MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';
import {LieuApilmtService} from '../../services/lieu-apilmt.service';

@Component({
  selector: 'app-lieu',
  templateUrl: './lieu.component.html',
  styleUrls: ['./lieu.component.scss']
})
export class LieuComponent implements OnInit {

  userLoggedIn: true;
  displayedColumnsLieux: string[] = ['Nom Lieu', 'Actions'];
  lieu = new Lieu();
  lieux: Lieu[] = [];
  lieuxSubscription: Subscription;
  lieuxMatTable: MatTableDataSource<Lieu>  = new MatTableDataSource<Lieu>(this.lieux);
  lieuToModify = new Map<string, Lieu>();

  constructor(private lieuAPILMTService: LieuApilmtService) { }


  ngOnInit() {

    this.lieuxSubscription = this.lieuAPILMTService.lieuxSubject.subscribe(
      (lieux: Lieu[]) => {
        this.lieuxMatTable.data = lieux;
        this.lieuxMatTable._updateChangeSubscription();
      }
    );
    this.lieuAPILMTService.getAllLieux();
  }

  onCreateNewLieuxClick() {
    const newLieu = new Lieu();
    newLieu.isOnUpdate = true;
    this.lieuxMatTable.data.unshift(newLieu);
    this.lieuxMatTable._updateChangeSubscription();
  }

  onSaveButtonClick(lieu: Lieu) {
    lieu.isOnUpdate = false;
    if (!lieu._links) {
      this.lieuAPILMTService.addLieu(lieu);
    } else {
      this.lieuAPILMTService.updateLieu(lieu);
      this.lieuToModify.delete(lieu._links.self.href);
    }
  }

  onEditButtonClick(lieu: Lieu) {
    this.lieuToModify.set(lieu._links.self.href, this.cloneObject(lieu));
    lieu.isOnUpdate = true;

  }

  onDeleteButtonClick(lieu: Lieu) {
    if (lieu._links) {
      this.lieuAPILMTService.deleteLieu(lieu);
      this.lieuxMatTable._updateChangeSubscription();
    }
  }

  onCancelButtonClick(lieu: Lieu) {
    lieu.isOnUpdate = false;
    if (lieu._links.self.href) {
      this.copieObject(this.lieuToModify.get(lieu._links.self.href), lieu);
      this.lieuToModify.delete(lieu._links.self.href);
    } else {
      this.lieuxMatTable.data.splice(this.lieuxMatTable.data.indexOf(lieu), 1);
    }
    this.lieuxMatTable._updateChangeSubscription();
  }


  cloneObject(src): Lieu {
    const target = new Lieu();
    for (const prop in src) {
      if (src.hasOwnProperty(prop)) {
        target[prop] = src[prop];
      }
    }
    return target;
  }

  copieObject(src: Lieu, target: Lieu): Lieu {
    for (const prop in src) {
      if (src.hasOwnProperty(prop)) {
        target[prop] = src[prop];
      }
    }
    return target;
  }
}
