import {RestFullObject} from './RestFullObject';
import {BesoinsComponent} from '../components/besoins/besoins.component';

export class ReponseAuxBesoins extends RestFullObject {

  besoinRemonte: BesoinsComponent;

  quantite: number;

  description: string;

  isOnUpdate: boolean;

  constructor(_links?: any) {
    super(_links);
  }
}
