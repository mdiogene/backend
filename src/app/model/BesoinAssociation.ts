import {RestFullObject} from './RestFullObject';
import {Alimentaire} from './Alimentaire';
import {Vetement} from './Vetement';
import {Services} from './Service';


export class BesoinAssociation extends RestFullObject {

  alimentaire: Alimentaire;

  vetement: Vetement;

  service: Services;

  description: string;

  isOnUpdate: boolean;

  constructor(_links?: any) {
    super(_links);
  }
}
