import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Maraude} from '../../model/Maraude';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {MaraudeApilmtService} from '../../services/maraude-apilmt.service';
import {Subscription} from 'rxjs';
import {LieuApilmtService} from '../../services/lieu-apilmt.service';
import {Lieu} from '../../model/Lieu';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations/';

@Component({
  selector: 'app-maraudes',
  templateUrl: './maraudes.component.html',
  styleUrls: ['./maraudes.component.scss']
})

export class MaraudesComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  userLoggedIn: boolean;
  displayedColumnsMaraudes: string[] = ['Lieu', 'Participants', 'Date', 'Duree', 'Commentaire', 'Actions'];
  maraudeToModify = new Map<string, Maraude>();
  maraude = new Maraude();
  maraudes: Maraude[] = [];
  maraudesSubscription: Subscription;
  lieux: Lieu[] = [];
  lieuxSubscription: Subscription;
  maraudesMatTable: MatTableDataSource<Maraude>  = new MatTableDataSource<Maraude>(this.maraudes);
  constructor(private maraudesAPILMTService: MaraudeApilmtService, private lieuxAPILMTService: LieuApilmtService) { }

  ngOnInit() {
    this.maraudesMatTable.paginator = this.paginator;
    if (localStorage.getItem('userLoggedIn')) {
      this.userLoggedIn = true;
    } else {
      this.userLoggedIn = false;
    }
    this.maraudesSubscription = this.maraudesAPILMTService.maraudesSubject.subscribe(
      (maraudes: Maraude[]) => {
        console.log(maraudes);
        this.maraudesMatTable.data = maraudes;
        this.maraudesMatTable._updateChangeSubscription();
      }
    );

    this.lieuxSubscription = this.lieuxAPILMTService.lieuxSubject.subscribe(
      (lieux: Lieu[]) => {
        this.lieux = lieux;
      }
    );
this.maraudesAPILMTService.getAllMaraudes();
this.lieuxAPILMTService.getAllLieux();
  }

  ngOnDestroy(): void {
    this.maraudesSubscription.unsubscribe();
  }

  onCreateNewMaraudeClick() {

    const newMaraude = new Maraude();
    newMaraude.isOnUpdate = true;
    this.maraudesMatTable.data.unshift(newMaraude);
    this.maraudesMatTable._updateChangeSubscription();
  }

  onSaveButtonClick(maraude: Maraude) {
    maraude.isOnUpdate = false;
    if (maraude._links) {
      this.maraudesAPILMTService.updateMaraude(maraude);
    } else {
      this.maraudesAPILMTService.addMaraude(maraude);
    }
  }

  onCancelButtonClick(maraude: Maraude) {
    maraude.isOnUpdate = false;
    if (maraude._links.self.href) {
      this.copieObject(this.maraudeToModify.get(maraude._links.self.href), maraude);
      this.maraudeToModify.delete(maraude._links.self.href);
    } else {
      this.maraudesMatTable.data.splice(this.maraudesMatTable.data.indexOf(maraude), 1);
    }
    this.maraudesMatTable._updateChangeSubscription();
  }

  cloneObject(src): Maraude {
    const target = new Maraude();
    for (const prop in src) {
      if (src.hasOwnProperty(prop)) {
        target[prop] = src[prop];
      }
    }
    return target;
  }

  copieObject(src: Maraude, target: Maraude): Maraude {
    for (const prop in src) {
      if (src.hasOwnProperty(prop)) {
        target[prop] = src[prop];
      }
    }
    return target;
  }

  onEditButtonClick(maraude: Maraude) {

    this.maraudeToModify.set(maraude._links.self.href, this.cloneObject(maraude));
    maraude.isOnUpdate = true;
  }

  onDeleteButtonClick(maraude: any | Maraude) {
    maraude.isOnUpdate = false;
    if (maraude._links.self.href) {
      this.maraudesAPILMTService.deleteMaraude(maraude);
    }
    this.maraudesMatTable._updateChangeSubscription();

  }
}
