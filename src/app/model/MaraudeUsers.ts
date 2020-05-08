import {RestFullObject} from './RestFullObject';

import {Maraude} from './Maraude';
import {User} from './User';


export class MaraudeUsers extends RestFullObject {
  user: User;
  maraude: Maraude;
  participate: boolean;
  vehicule: boolean;
  isOnUpdate: boolean;
  constructor(_links?: any) {
    super(_links);
  }
}
