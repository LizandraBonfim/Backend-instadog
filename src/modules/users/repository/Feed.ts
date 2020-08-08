import { Repository, getRepository, AdvancedConsoleLogger } from 'typeorm';
import Photos from '../models/Photos';

interface Request {
    page: number;
    items: number;
}

class Feed {

    private ormRepository: Repository<Photos>;

    constructor() {
        this.ormRepository = getRepository(Photos);
    }

    public async execute({ page, items }: Request) {

        const [result, total] = await this.ormRepository.findAndCount({
            take: items,
            skip: (page * items) - items
        });

        console.log('page', (page * items) - items);
        console.log('item', items);

        return {
            result,
            total
        }
    }

}

export default Feed;