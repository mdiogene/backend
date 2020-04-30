import {RestFullObject} from './RestFullObject';

export class TypeBesoin extends RestFullObject {
  type: string;
  description: string;
  isOnUpdate: boolean;
  constructor(_links?: any) {
    super(_links);
  }
}
