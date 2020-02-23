import {RestFullObject} from './RestFullObject';
import {Lieu} from './Lieu';

export class Maraude extends RestFullObject {
duree: string;
  commentaire: string;
   date: string;
  participantMax: number;
  lieu: Lieu;
  isOnUpdate: boolean;
  constructor(_links?: any) {
    super(_links);
  }
}
