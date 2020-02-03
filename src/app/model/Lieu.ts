import {RestFullObject} from './RestFullObject';

export class Lieu extends RestFullObject {
  lieuName: string;
  isOnUpdate: boolean;
  constructor(_links?: any) {
    super(_links);
  }
}
