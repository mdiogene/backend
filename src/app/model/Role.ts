import {RestFullObject} from './RestFullObject';


export class Role extends RestFullObject {
  roleName: string;
  // users: User[] = [];
  isOnUpdate: boolean;
  constructor(_links?: any) {
    super(_links);
  }
}
