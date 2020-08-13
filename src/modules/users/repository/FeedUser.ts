import { Repository, getRepository } from 'typeorm';
import Photos from '../models/Photos';
import User from '../models/User';

class FeedUser {

    private ormRepositoryUser: Repository<User>;
    private ormRepositoryPhotos: Repository<Photos>;

    constructor() {
        this.ormRepositoryPhotos = getRepository(Photos);
        this.ormRepositoryUser = getRepository(User);

    }

    public async execute(id: string, page: number, items: number): Promise<Photos[]> {

        const user = await this.ormRepositoryUser.findOne({
            where: { id }
        })

        if (!user) throw new Error('Este usuario não existe');


        const posts = await this.ormRepositoryPhotos.find({
            where: { user: user.id },
            take: items,
            skip: (page * items) - items
        });

        if (!posts) throw new Error('Este usuario não existe');

        delete user.password;


        return posts;
    }

}

export default FeedUser;