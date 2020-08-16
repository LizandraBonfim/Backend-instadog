import { Repository, getRepository } from 'typeorm';
import User from '../models/User';

class FeedUser {

    private ormRepositoryUser: Repository<User>;

    constructor() {

        this.ormRepositoryUser = getRepository(User);

    }

    public async execute(id: string): Promise<User> {

        const user = await this.ormRepositoryUser.findOne({
            where: { id }
        })

        if (!user) throw new Error('Este usuario não existe');


        delete user.password;


        return user;
    }

}

export default FeedUser;