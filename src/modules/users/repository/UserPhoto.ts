import { Repository, getRepository, AdvancedConsoleLogger } from 'typeorm';
import Photos from '../models/Photos';
import User from '../models/User';
import Comments from '../models/Comments';

class UserPhoto {

    private ormRepositoryAvatar: Repository<Photos>;
    private ormRepositoryComments: Repository<Comments>;

    constructor() {
        this.ormRepositoryAvatar = getRepository(Photos);
        this.ormRepositoryComments = getRepository(Comments);
    }

    public async execute(id: string): Promise<any> {

        const photoId = await this.ormRepositoryAvatar.findOne({
            where: { id },
            relations: ['user_id'],

        });


        if (!photoId) throw new Error('Foto não localizada.');

        const userComments = await this.ormRepositoryComments.find({
            where: { post: photoId.id },
            relations: ['user_id'],
        });

        console.log(`coenss`, userComments)

        photoId.acessos = photoId.acessos + 1;

        this.ormRepositoryAvatar.update({ id: photoId.id }, { acessos: photoId.acessos });

        return {
            photoId,
            userComments
        }
    }

}

export default UserPhoto;