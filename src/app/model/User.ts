import {RestFullObject} from './RestFullObject';
import {Role} from './Role';

export class User extends RestFullObject {
  userId: string;
  name: string;
  prenom: string;
  email: string;
  password: string;
  isOnUpdate: boolean;
  vehicule: boolean;
  tel: string;
  urlPhoto: string;
  isOnLine: boolean;
  role: Role;

  constructor(id?: number, userId?: string, name?: string, prenom?: string,
              email?: string, password?: string, telNumber?: string, vehicule?: boolean, isOnLine?: boolean, urlPicture?: string, role?: Role, _links?: any) {
    super(_links);
    this.id = id;
    this.userId = this.userId;
    this.name = name;
    this.prenom = prenom;
    this.email = email;
    this.password = password;
    this.isOnUpdate = false;
    this.tel = telNumber;
    this.urlPhoto = urlPicture;
    this.role = role;
    this.vehicule = vehicule;
    this.isOnLine = false;
  }
}
