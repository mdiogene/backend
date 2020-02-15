import { Component, OnInit } from '@angular/core';
import {Role} from '../../model/Role';
import {MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';
import {RoleApilmtService} from '../../services/role-apilmt.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  userLoggedIn: true;
  displayedColumnsRoles: string[] = ['Nom Role', 'Actions'];
  role = new Role();
  roles: Role[] = [];
  rolesSubscription: Subscription;
  rolesMatTable: MatTableDataSource<Role>  = new MatTableDataSource<Role>(this.roles);
  constructor(private roleAPILMTService: RoleApilmtService) { }


  ngOnInit() {

    this.rolesSubscription = this.roleAPILMTService.rolesSubject.subscribe(
      (roles: Role[]) => {
        this.rolesMatTable.data = roles;
        this.rolesMatTable._updateChangeSubscription();
      }
    );
    this.roleAPILMTService.getAllRoles();
  }

  onCreateNewRolesClick() {
    const newRole = new Role();
    newRole.isOnUpdate = true;
    this.rolesMatTable.data.unshift(newRole);
    this.rolesMatTable._updateChangeSubscription();
  }

  onSaveButtonClick(role: Role) {
    role.isOnUpdate = false;
    if (!role._links) {
      this.roleAPILMTService.addRole(role);
    }
  }

  onEditButtonClick(role: any | Role) {

  }

  onDeleteButtonClick(role: any | Role) {

  }

  onCancelButtonClick(role: any | Role) {

  }
}
