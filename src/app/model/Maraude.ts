import {RestFullObject} from './RestFullObject';

export class Maraude extends RestFullObject {
duree: string;
  commentaire: string;
   date: string;
  participantsMax: number;
  isOnUpdate: boolean;
  constructor(_links?: any) {
    super(_links);
  }
}
