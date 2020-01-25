import {RestFullObject} from './RestFullObject';

export class Maraude extends RestFullObject {
  numero: number;
  lieuNom: string;
  date: string;
  participantsMax: number;
  isOnUpdate: boolean;
  constructor(numero?: number, lieuNom?: string, date?: string, participantsMax?: number, _links?: any) {
    super(_links);
  }
}
