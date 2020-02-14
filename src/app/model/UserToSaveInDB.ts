import {RestFullObject} from './RestFullObject';
import {Role} from './Role';


export class UserToSaveInDB extends RestFullObject {

  userId: string;
  name: string;
  prenom: string;
  email: string;
  password: string;
  vehicule: boolean;
  tel: string;
  urlPhoto: string;
  role: Role = new Role();

  constructor(userId?: string, name?: string, prenom?: string,
              email?: string, password?: string, tel?: string, vehicule?: boolean, role?: Role, urlPicture?: string, _links?: any) {
    super(_links);

    this.userId = this.userId;
    this.name = name;
    this.prenom = prenom;
    this.email = email;
    this.password = password;

    this.tel = tel;
    this.urlPhoto = urlPicture;
  this.role = role;
    this.vehicule = vehicule;
  }
}
