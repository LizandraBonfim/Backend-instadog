import { Repository, getRepository, AdvancedConsoleLogger } from 'typeorm';
import Photos from '../models/Photos';
import User from '../models/User';
import Comments from '../models/Comments';

class UserPhoto {

    private ormRepositoryAvatar: Repository<Photos>;
    private ormRepositoryUser: Repository<User>;
    private ormRepositoryComments: Repository<Comments>;

    constructor() {
        this.ormRepositoryAvatar = getRepository(Photos);
        this.ormRepositoryUser = getRepository(User);
        this.ormRepositoryComments = getRepository(Comments);
    }

    public async execute(id: string): Promise<any> {

        const photoId = await this.ormRepositoryAvatar.findOne({
            where: { id }
        });


        if (!photoId) throw new Error('Foto não localizada.');

        const userId = await this.ormRepositoryUser.findOne({
            where: { id: photoId.user }
        });

        if (!userId) throw new Error('Usuário não localizado.');

        const userComments = await this.ormRepositoryComments.findOne({
            where: { post: photoId.id }
        });


        if (!userComments) throw new Error('Não ha comentaro para essa foto.');


        return {
            photoId,
            userId,
            userComments
        }
    }

}

export default UserPhoto;