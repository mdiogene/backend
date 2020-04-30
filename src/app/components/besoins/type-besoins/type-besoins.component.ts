import { Component, OnInit } from '@angular/core';
import {TypeBesoin} from '../../../model/TypeBesoin';
import {Subscription} from 'rxjs';
import {MatTableDataSource} from '@angular/material';
import {TypeBesoinsService} from '../../../services/Besoins/type-besoins.service';

@Component({
  selector: 'app-type-besoins',
  templateUrl: './type-besoins.component.html',
  styleUrls: ['./type-besoins.component.scss']
})
export class TypeBesoinsComponent implements OnInit {
  displayedColumnsTypeBesoins: string[] = ['Nom TypeBesoin', 'Description', 'Actions'];
  typeBesoin = new TypeBesoin();
  typeBesoins: TypeBesoin[] = [];
  typeBesoinsSubscription: Subscription;
  typeBesoinsMatTable: MatTableDataSource<TypeBesoin>  = new MatTableDataSource<TypeBesoin>(this.typeBesoins);
  typeBesoinToModify = new Map<string, TypeBesoin>();

  constructor(private typeBesoinService: TypeBesoinsService) { }


  ngOnInit() {

    this.typeBesoinsSubscription = this.typeBesoinService.typebesoinSubject.subscribe(
      (typeBesoins: TypeBesoin[]) => {
        this.typeBesoinsMatTable.data = typeBesoins;
        this.typeBesoinsMatTable._updateChangeSubscription();
      }
    );
    this.typeBesoinService.getAllTypeBesoin();
  }

  onCreateNewTypeBesoinsClick() {
    const newTypeBesoin = new TypeBesoin();
    newTypeBesoin.isOnUpdate = true;
    this.typeBesoinsMatTable.data.unshift(newTypeBesoin);
    this.typeBesoinsMatTable._updateChangeSubscription();
  }

  onSaveButtonClick(typeBesoin: TypeBesoin) {
    typeBesoin.isOnUpdate = false;
    if (!typeBesoin._links) {
      this.typeBesoinService.addTypeBesoin(typeBesoin);
    } else {
      this.typeBesoinService.updateTypeBesoin(typeBesoin);
      this.typeBesoinToModify.delete(typeBesoin._links.self.href);
    }
  }

  onEditButtonClick(typeBesoin: TypeBesoin) {
    this.typeBesoinToModify.set(typeBesoin._links.self.href, this.cloneObject(typeBesoin));
    typeBesoin.isOnUpdate = true;

  }

  onDeleteButtonClick(typeBesoin: TypeBesoin) {
    if (typeBesoin._links) {
      this.typeBesoinService.deleteTypeBesoin(typeBesoin);
      this.typeBesoinsMatTable._updateChangeSubscription();
    }
  }

  onCancelButtonClick(typeBesoin: TypeBesoin) {
    typeBesoin.isOnUpdate = false;
    if (typeBesoin._links.self.href) {
      this.copieObject(this.typeBesoinToModify.get(typeBesoin._links.self.href), typeBesoin);
      this.typeBesoinToModify.delete(typeBesoin._links.self.href);
    } else {
      this.typeBesoinsMatTable.data.splice(this.typeBesoinsMatTable.data.indexOf(typeBesoin), 1);
    }
    this.typeBesoinsMatTable._updateChangeSubscription();
  }


  cloneObject(src): TypeBesoin {
    const target = new TypeBesoin();
    for (const prop in src) {
      if (src.hasOwnProperty(prop)) {
        target[prop] = src[prop];
      }
    }
    return target;
  }

  copieObject(src: TypeBesoin, target: TypeBesoin): TypeBesoin {
    for (const prop in src) {
      if (src.hasOwnProperty(prop)) {
        target[prop] = src[prop];
      }
    }
    return target;
  }


}
