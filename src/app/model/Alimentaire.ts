import {RestFullObject} from './RestFullObject';

export class Alimentaire extends RestFullObject {

  typeNom: string;

  description: string;

  isOnUpdate: boolean;

  constructor(_links?: any) {
    super(_links);
  }
}
