import { Injectable } from '@angular/core';
import {Role} from '../model/Role';
import {apiLMT} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {LoadingService} from './loading-service.service';
import {AlertService} from './alert-service.service';
import {Subject} from 'rxjs';
import {DialogConfirmationDialogComponent} from '../components/dialog-confirmation-dialog/dialog-confirmation-dialog.component';
import {MatDialog} from '@angular/material';



@Injectable({
  providedIn: 'root'
})
export class RoleApilmtService {

  private roleAPILmtUrl = `${apiLMT.url}/roles`;
  roles: Role[] = [];
  rolesSubject = new Subject<Role[]>();
  role: Role = new Role();
  roleSubject = new Subject<Role>();
  // roleSubject = new Subject<Roles>();

  constructor(private http: HttpClient,
              public loadingService: LoadingService,
              public alertService: AlertService,
              private dialog: MatDialog) { }

  getAllRoles(): void {
    this.roles = null;
    this.http.get<any>(this.roleAPILmtUrl).subscribe(
      next => {
        const roles = next._embedded.roles;
        if (roles && roles.length > 0) {
          this.roles = next._embedded.roles;
        }
        this.emitRolesSubject();
      },
      error => {
        console.log(error);
        this.handleError(error);
      }
    );
  }

  emitRolesSubject() {
    if (this.roles) {
      this.rolesSubject.next(Array.from(this.roles));
    }
    this.loadingService.hideLoading();
  }

  emitRoleSubject() {
    if (this.role) {
      this.roleSubject.next(this.role);
    }
   this.loadingService.hideLoading();
  }

  addRole(role: Role): void {
    this.loadingService.showLoading();
    this.http.post<Role>(this.roleAPILmtUrl, role).subscribe(
      next => {
        this.roles.unshift(next);
        this.emitRolesSubject();
      },
      error => {
        this.handleError(error);
      }
    );
  }


  getRoleByRoleName(roleName: string): void {
   this.loadingService.showLoading();
    this.http.get<Role>(this.roleAPILmtUrl + '/search/findByRoleName?roleName=' + roleName).subscribe(
      next => {
        if (next) {
          this.role = next;
        }
        this.emitRoleSubject();
      },
      error => {
        this.handleError(error);
      }
    );
  }


  getRoleById(id: number): void {
    this.loadingService.showLoading();
    this.http.get<Role>(this.roleAPILmtUrl + '/' + id).subscribe(
      next => {
        const role = next;
        if (role) {
          this.role = role;
         // console.log(this.role);
        }
        this.emitRoleSubject();
      },
      error => {
        this.handleError(error);
      }
    );
  }

  getRoleByIdNotVoid(id: number): void {
    this.loadingService.showLoading();
    this.http.get<Role>(this.roleAPILmtUrl + '/' + id).subscribe(
      next => {
        if (next) {
          this.role = next;
          this.emitRoleSubject();
          console.log('rolesServices');
          console.log(this.role);
        }

      },
      error => {
        this.handleError(error);
      }
    );
  }

  updateRole(role: Role): void {
    this.loadingService.showLoading();
    if (role._links) {
      const urlHref = this.getUrlForUpdateAndDelete(role._links.self.href, 'roles', `${apiLMT.url}`);
      this.http.put<Role>(urlHref, role).subscribe(
        next => {
          console.log('dans update service');
          console.log(next);
          this.roles[this.roles.indexOf(role)] = next;
          this.emitRolesSubject();
        },
        error => {
          this.handleError(error);
        }
      );
    }
  }

deleteRole(role: Role) {
  if (role._links) {
    const urlHref = this.getUrlForUpdateAndDelete(role._links.self.href, 'roles', `${apiLMT.url}`);

    this.http.delete<Role>(urlHref).subscribe(
      next => {
        const info = 'Role a été suprimé';
        this.openDialog(info);

        this.roles.splice(this.roles.indexOf(role), 1);
        this.emitRolesSubject();
      },
      error => {
        this.handleError(error);
      }
    );
  }

}
  getUrlForUpdateAndDelete(url: string, objectToAdd: string, urlToAdd: string): string {
    const urlObject = url.substring(url.indexOf(objectToAdd), url.length );
    const vraiUrl = urlToAdd + '/' + urlObject;
    return vraiUrl;
  }
  openDialog(information: string): void {
    const dialogRef = this.dialog.open(DialogConfirmationDialogComponent, {
      width: '400px',
      data: {information: information}
    });
  }

  handleError(error): void {
    this.loadingService.hideLoading();
    this.alertService.error(error.message);
  }
}
