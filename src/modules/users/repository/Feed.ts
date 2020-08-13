import { Repository, getRepository, AdvancedConsoleLogger } from 'typeorm';
import Photos from '../models/Photos';

interface Request {
    page: number;
    items: number;
    user?: string;
}

class Feed {

    private ormRepository: Repository<Photos>;

    constructor() {
        this.ormRepository = getRepository(Photos);
    }

    public async execute({ page, items, user }: Request) {

        console.log(user)
        if (!!!user) {
            const [result,] = await this.ormRepository.findAndCount({
                take: items,
                skip: (page * items) - items,
            });

            return result;

        }


        const [result,] = await this.ormRepository.findAndCount({
            take: items,
            skip: (page * items) - items,
            where: { user: user }
        });

        return result;
    }

}

export default Feed;