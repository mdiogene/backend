import {RestFullObject} from './RestFullObject';

export class User extends RestFullObject {
  id: number;
  userId: string;
  name: string;
  prenom: string;
  email: string;
  password: string;
  isOnUpdate: boolean;
  isOnline: boolean;
  urlPhoto: string;
  isAdmin: boolean;

  constructor(id?: number, userId?: string, name?: string, prenom?: string,
              email?: string, password?: string, urlPicture?: string, isAdmin?: boolean, _links?: any) {
    super(_links);
    this.id = id;
    this.userId = this.userId;
    this.name = name;
    this.prenom = prenom;
    this.email = email;
    this.password = password;
    this.isOnUpdate = false;
    this.isOnline = false;
    this.urlPhoto = urlPicture;
    this.isAdmin = isAdmin;
  }
}
