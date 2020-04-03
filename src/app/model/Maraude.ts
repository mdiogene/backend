import {RestFullObject} from './RestFullObject';
import {Lieu} from './Lieu';
import DateTimeFormat = Intl.DateTimeFormat;
import DateTimeFormatPartTypes = Intl.DateTimeFormatPartTypes;
import DateTimeFormatPart = Intl.DateTimeFormatPart;

export class Maraude extends RestFullObject {
duree: string;
  commentaire: string;
   date: DateTimeFormat;
  participantMax: number;
  lieu: Lieu;
  isOnUpdate: boolean;
  constructor(_links?: any) {
    super(_links);
  }
}
