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
    }
  }

  onEditButtonClick(lieu: any | Lieu) {

  }

  onDeleteButtonClick(lieu: any | Lieu) {

  }

  onCancelButtonClick(lieu: any | Lieu) {

  }
}
