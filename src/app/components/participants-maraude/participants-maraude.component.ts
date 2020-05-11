import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';
import {Lieu} from '../../model/Lieu';
import {LieuApilmtService} from '../../services/lieu-apilmt.service';
import {MaraudeUsers} from '../../model/MaraudeUsers';
import {MaraudeUsersService} from '../../services/maraude-users.service';
import {ActivatedRoute} from '@angular/router';
import {stringify} from 'querystring';


@Component({
  selector: 'app-participants-maraude',
  templateUrl: './participants-maraude.component.html',
  styleUrls: ['./participants-maraude.component.scss']
})
export class ParticipantsMaraudeComponent implements OnInit, OnDestroy {
  @ViewChild('participantsSort') matSort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  userLoggedIn: boolean;
  displayedColumnsMaraudeUsers: string[] = ['Lieu', 'Date', 'Nom', 'Prénom'];
  maraudeUserToModify = new Map<string, MaraudeUsers>();
  maraudeUser = new MaraudeUsers();
  maraudeUsers: MaraudeUsers[] = [];
  maraudeUsersSubscription: Subscription;
  lieux: Lieu[] = [];
  lieuxSubscription: Subscription;
  maraudeUsersMatTable: MatTableDataSource<MaraudeUsers>  = new MatTableDataSource<MaraudeUsers>();
  lieuSelectionne = new Lieu();
  date = '';
  maraudeId: number;
  constructor(private maraudeUsersAPILMTService: MaraudeUsersService,
              private route: ActivatedRoute,
              private lieuxAPILMTService: LieuApilmtService) { }

  ngOnInit() {


    this.maraudeUsersMatTable.filterPredicate = function (data: MaraudeUsers, filter: string): boolean {
      const reg = new RegExp('^.*(' + filter  + ').*$');
      return reg.test(data.maraude.lieu.lieuName.toLowerCase()) ||
        reg.test(data.maraude.participantMax.toString()) ||
        reg.test(String(data.maraude.date)) ;
    };

    this.maraudeUsersMatTable.sort = this.matSort;
    this.maraudeUsersMatTable.paginator = this.paginator;
    if (this.route.snapshot.params['maraudeId']) {
      this.maraudeId = this.route.snapshot.params['maraudeId'];

      console.log('only maraudeId');
      console.log(this.maraudeId);
      this.maraudeUsersAPILMTService.getAllMaraudeUsersByMaraudeId(this.maraudeId);
      this.maraudeUsersMatTable.data = this.maraudeUsers;
      this.maraudeUsersMatTable._updateChangeSubscription();

      console.log('only usersMaraude of id maraude');
      console.log(this.maraudeUsers);
    }

    if (localStorage.getItem('userLoggedIn')) {
      this.userLoggedIn = true;
    } else {
      this.userLoggedIn = false;
    }
    this.maraudeUsersSubscription = this.maraudeUsersAPILMTService.maraudeUsersSubject.subscribe(
      (maraudeUsers: MaraudeUsers[]) => {
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
    if (this.route.snapshot.params['maraudeId']) {
      this.maraudeId = this.route.snapshot.params['maraudeId'];

      console.log('only maraudeId');
      console.log(this.maraudeId);
      this.maraudeUsersAPILMTService.getAllMaraudeUsersByMaraudeId(this.maraudeId);
      console.log('only usersMaraude of id maraude');
      console.log(this.maraudeUsers);
    } else {
      this.maraudeUsersAPILMTService.getAllMaraudeUsers();
    }
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

  getParticipantByDate(date: string){
    const participantsParDate: MaraudeUsers[] = [];
    this.maraudeUsers.forEach(maraudeUser => {
      if (date.toString().substring(1, 10) === (maraudeUser.maraude.date.toString().substring(1, 10))) {
        participantsParDate.unshift(maraudeUser);
      }
    });

      this.maraudeUsersMatTable.data = participantsParDate;
    this.maraudeUsersMatTable._updateChangeSubscription();

  }
  onSubmit() {
    this.maraudeUsers = null;
    console.log('submit:');
    console.log(this.date);

    if (this.lieuSelectionne && this.date) {
      this.maraudeUsersAPILMTService.getAllMaraudeUsersByLieuAndDate(this.lieuSelectionne, this.date);
      this.getParticipantByDate(this.date);
    } else {
     this.maraudeUsersAPILMTService.getAllMaraudeUsersByLieu(this.lieuSelectionne);
     this.getParticipantByDate(this.date);
  }
    console.log('only ou submit lieu');
    console.log(this.maraudeUsers);

  }

  applyFilter(filterValue: string) {

    this.maraudeUsersMatTable.filter = filterValue.trim().toLowerCase();
    // this.maraudeUsersMatTable._updateChangeSubscription();
  }
}

