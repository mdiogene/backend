import {RestFullObject} from './RestFullObject';


export class UserRole extends RestFullObject {
  userId: number;
  roleId: number;
  isOnUpdate: boolean;
  constructor(_links?: any) {
    super(_links);
  }
}
