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

  roleLoggedIn: true;
  displayedColumnsRoles: string[] = ['Nom Role', 'Actions'];
  role = new Role();
  roles: Role[] = [];
  rolesSubscription: Subscription;
  rolesMatTable: MatTableDataSource<Role>  = new MatTableDataSource<Role>(this.roles);
  roleToModify = new Map<string, Role>();

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
    } else {
      this.roleAPILMTService.updateRole(role);
      this.roleToModify.delete(role._links.self.href);
    }
  }

  onEditButtonClick(role: any | Role) {
    this.roleToModify.set(role._links.self.href, this.cloneObject(role));
    role.isOnUpdate = true;

  }

  onDeleteButtonClick(role: Role) {
    if (role._links) {
      this.roleAPILMTService.deleteRole(role);
      this.rolesMatTable._updateChangeSubscription();
    }
  }

  onCancelButtonClick(role: Role) {
    role.isOnUpdate = false;
    if (role._links.self.href) {
      this.copieObject(this.roleToModify.get(role._links.self.href), role);
      this.roleToModify.delete(role._links.self.href);
    } else {
      this.rolesMatTable.data.splice(this.rolesMatTable.data.indexOf(role), 1);
    }
    this.rolesMatTable._updateChangeSubscription();
  }


  cloneObject(src): Role {
    const target = new Role();
    for (const prop in src) {
      if (src.hasOwnProperty(prop)) {
        target[prop] = src[prop];
      }
    }
    return target;
  }

  copieObject(src: Role, target: Role): Role {
    for (const prop in src) {
      if (src.hasOwnProperty(prop)) {
        target[prop] = src[prop];
      }
    }
    return target;
  }
}
