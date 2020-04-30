import {RestFullObject} from './RestFullObject';

export class Vetement extends RestFullObject {

  typeNom: string;

  description: string;

  isOnUpdate: boolean;

  constructor(_links?: any) {
    super(_links);
  }
}
