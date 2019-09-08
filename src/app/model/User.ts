
export class User {
  id: number;
  userId: string;
  name: string;
  prenom: string;
  email: string;
  password: string;
  isOnUpdate: boolean;
  isOnline: boolean;
  urlPicture: string;
  isAdmin: boolean;

  constructor(id?: number, userId?: string, name?: string, prenom?: string,
              email?: string, password?: string, urlPicture?: string, isAdmin?: boolean) {
    this.id = id;
    this.userId = this.userId;
    this.name = name;
    this.prenom = prenom;
    this.email = email;
    this.password = password;
    this.isOnUpdate = false;
    this.isOnline = false;
    this.urlPicture = urlPicture;
    this.isAdmin = isAdmin;
  }
}
