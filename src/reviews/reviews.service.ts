import { Injectable} from "@nestjs/common";

@Injectable()
export class ReviewsService {
    constructor() {}
       public getAll() {
        return [
            {id: 1, description: 'good'},
            {id: 2, description: 'bad'},
            {id: 3, description: 'excellent'},
            {id: 4, description: 'very good'},
        ]
    }
}