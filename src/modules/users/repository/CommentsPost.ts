import { Repository, getRepository } from 'typeorm';
import User from '../models/User';
import Photos from '../models/Photos';
import Comments from '../models/Comments';



class CommentsPost {

    private ormRepositoryAvatar: Repository<Photos>;
    private ormRepositoryUser: Repository<User>;
    private ormRepositoryComments: Repository<Comments>;

    constructor() {
        this.ormRepositoryAvatar = getRepository(Photos);
        this.ormRepositoryUser = getRepository(User);
        this.ormRepositoryComments = getRepository(Comments);
    }


    public async postar(id: string, comment: string): Promise<any> {

        const comentario = new Comments();


        const coment = await this.ormRepositoryAvatar.findOne({
            where: { id }
        });

        if (!coment) throw new Error('Post não localizado.');


        const user = await this.ormRepositoryUser.findOne({
            where: { id: coment.user }
        });

        if (!user) throw new Error('Usuario não localizado.');

        comentario.comment = comment;
        comentario.user = user.id;
        comentario.post = id;

        console.log('comentario', comentario.comment);
        console.log('comentario', comentario.user);
        console.log('comentario', comentario.post);

        const newComment = await this.ormRepositoryComments.create(comentario);

        console.log('usuario salvo ? ', newComment)
        await this.ormRepositoryComments.save(newComment);

        return 'Comentario postado';


    }

    public async deletar(id: string): Promise<void> {


        const idComments = await this.ormRepositoryComments.findOne({
            where: { id }
        });


        if (!idComments)
            throw new Error('Não existe id para esse comentario');

        console.log(idComments);

        const user = await this.ormRepositoryUser.findOne({
            where: { id: idComments.user }
        });

        if (!user)
            throw new Error('Para deletar foto, é necessario estar logado');


        if (idComments.user !== user.id) {
            throw new Error('Não é possivel deletar comentario de outro usuario');
        }

        await this.ormRepositoryComments.delete({ id: idComments.id });


    }



}

export default CommentsPost;