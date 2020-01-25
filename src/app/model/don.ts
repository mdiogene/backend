import {RestFullObject} from './RestFullObject';

export class Don extends RestFullObject {
    id: number;
    userid: number;
    date: number;
    description: string;
    user_don: string;

    // tslint:disable-next-line:whitespace
    constructor(id?: number, userid?: number,date?: number, description?: string, user_don?: string, _links?: any) {
        super(_links);
        this.id = id;
        this.userid = this.userid;
        this.date = date;
        this.description = description;
        this.user_don = user_don;
    }
}


