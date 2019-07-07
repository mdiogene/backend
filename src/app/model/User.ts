
export class User {
  id: number;
  name: string;
  prenom: string;
  email: string;
  password: string;
  isOnUpdate: boolean;
  urlPicture: string;
  isAdmin: boolean;

  constructor(id?: number, name?: string, prenom?: string, email?: string, password?: string, urlPicture?: string, isAdmin?: boolean) {
    this.id = id;
    this.name = name;
    this.prenom = prenom;
    this.email = email;
    this.password = password;
    this.isOnUpdate = false;
    this.urlPicture = urlPicture;
    this.isAdmin = isAdmin;
  }
}
