import {Component, OnDestroy, OnInit} from '@angular/core';
import {Maraude} from '../../model/Maraude';
import {User} from '../../model/User';
import {MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-maraudes',
  templateUrl: './maraudes.component.html',
  styleUrls: ['./maraudes.component.scss']
})
export class MaraudesComponent implements OnInit, OnDestroy {

  displayedColumnsMaraudes: string[] = ['Numero', 'Lieu', 'Date', 'ParticipantsMax'];

  maraude = new Maraude();
  maraudes: Maraude[] = [];
  maraudesMatTable: MatTableDataSource<Maraude>  = new MatTableDataSource<Maraude>(this.maraudes);
  constructor() { }

  ngOnInit() {
    this.maraudesMatTable.data = this.maraudes;
  }

  ngOnDestroy(): void {
  }

  onCreateNewMaraudeClick() {

    const newMaraude = new Maraude();
    newMaraude.isOnUpdate = true;
    this.maraudesMatTable.data.unshift(newMaraude);
    this.maraudesMatTable._updateChangeSubscription();
  }
}
