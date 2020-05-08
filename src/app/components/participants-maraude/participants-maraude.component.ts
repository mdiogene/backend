import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';
import {Lieu} from '../../model/Lieu';
import {LieuApilmtService} from '../../services/lieu-apilmt.service';
import {MaraudeUsers} from '../../model/MaraudeUsers';
import {MaraudeUsersService} from '../../services/maraude-users.service';


@Component({
  selector: 'app-participants-maraude',
  templateUrl: './participants-maraude.component.html',
  styleUrls: ['./participants-maraude.component.scss']
})
export class ParticipantsMaraudeComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  userLoggedIn: boolean;
  displayedColumnsMaraudeUsers: string[] = ['Lieu', 'Date', 'Nom', 'Prénom'];
  maraudeUserToModify = new Map<string, MaraudeUsers>();
  maraudeUser = new MaraudeUsers();
  maraudeUsers: MaraudeUsers[] = [];
  maraudeUsersSubscription: Subscription;
  lieux: Lieu[] = [];
  lieuxSubscription: Subscription;
  maraudeUsersMatTable: MatTableDataSource<MaraudeUsers>  = new MatTableDataSource<MaraudeUsers>(this.maraudeUsers);
  lieuSelectionne = new Lieu();
  date: string;
  constructor(private maraudeUsersAPILMTService: MaraudeUsersService, private lieuxAPILMTService: LieuApilmtService) { }

  ngOnInit() {
    this.maraudeUsersMatTable.paginator = this.paginator;
    if (localStorage.getItem('userLoggedIn')) {
      this.userLoggedIn = true;
    } else {
      this.userLoggedIn = false;
    }
    this.maraudeUsersSubscription = this.maraudeUsersAPILMTService.maraudeUsersSubject.subscribe(
      (maraudeUsers: MaraudeUsers[]) => {
        console.log(maraudeUsers);
        this.maraudeUsers = maraudeUsers;
        this.maraudeUsersMatTable.data = this.maraudeUsers;
        this.maraudeUsersMatTable._updateChangeSubscription();
      }
    );

    this.lieuxSubscription = this.lieuxAPILMTService.lieuxSubject.subscribe(
      (lieux: Lieu[]) => {
        this.lieux = lieux;
      }
    );
    this.maraudeUsersAPILMTService.getAllMaraudeUsers();
    this.lieuxAPILMTService.getAllLieux();
  }

  ngOnDestroy(): void {
    this.maraudeUsersSubscription.unsubscribe();
  }

  onCreateNewMaraudeUsersClick() {

    const newMaraudeUsers = new MaraudeUsers();
    newMaraudeUsers.isOnUpdate = true;
    this.maraudeUsersMatTable.data.unshift(newMaraudeUsers);
    this.maraudeUsersMatTable._updateChangeSubscription();
  }

  onSaveButtonClick(maraudeUser: MaraudeUsers) {
    maraudeUser.isOnUpdate = false;
    if (maraudeUser._links) {
      // this.maraudeUsersAPILMTService.updateMaraudeUser(maraudeUser);
    } else {
      this.maraudeUsersAPILMTService.addMaraudeUser(maraudeUser);
    }
  }

  onCancelButtonClick(maraudeUser: MaraudeUsers) {
    maraudeUser.isOnUpdate = false;
    if (maraudeUser._links.self.href) {
      this.copieObject(this.maraudeUserToModify.get(maraudeUser._links.self.href), maraudeUser);
      this.maraudeUserToModify.delete(maraudeUser._links.self.href);
    } else {
      this.maraudeUsersMatTable.data.splice(this.maraudeUsersMatTable.data.indexOf(maraudeUser), 1);
    }
    this.maraudeUsersMatTable._updateChangeSubscription();
  }

  cloneObject(src): MaraudeUsers {
    const target = new MaraudeUsers();
    for (const prop in src) {
      if (src.hasOwnProperty(prop)) {
        target[prop] = src[prop];
      }
    }
    return target;
  }

  copieObject(src: MaraudeUsers, target: MaraudeUsers): MaraudeUsers {
    for (const prop in src) {
      if (src.hasOwnProperty(prop)) {
        target[prop] = src[prop];
      }
    }
    return target;
  }

  onEditButtonClick(maraudeUser: MaraudeUsers) {

    this.maraudeUserToModify.set(maraudeUser._links.self.href, this.cloneObject(maraudeUser));
    maraudeUser.isOnUpdate = true;
  }

  onDeleteButtonClick(maraudeUser: any | MaraudeUsers) {
    maraudeUser.isOnUpdate = false;
    if (maraudeUser._links.self.href) {
      // this.maraudeUsersAPILMTService.deleteMaraudeUsers(maraudeUser);
    }
    this.maraudeUsersMatTable._updateChangeSubscription();

  }

  onSubmit() {
    this.maraudeUsers = [];
   if (this.lieuSelectionne && this.date) {
      this.maraudeUsersAPILMTService.getAllMaraudeUsersByLieuAndDate(this.lieuSelectionne, this.date);
      this.maraudeUsersMatTable._updateChangeSubscription();
    } else {
     this.maraudeUsersAPILMTService.getAllMaraudeUsersByLieu(this.lieuSelectionne);
    this.maraudeUsersMatTable._updateChangeSubscription();
  }
}
}

