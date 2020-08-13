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


    public async postar(id: string, comment: string, idUsuarioLogado: string): Promise<any> {

        const comentario = new Comments();


        const photo = await this.ormRepositoryAvatar.findOne({
            where: { id }
        });

        if (!photo) throw new Error('Post não localizado.');


        const user = await this.ormRepositoryUser.findOne({
            where: { id: idUsuarioLogado }
        });

        if (!user) throw new Error('Usuario não localizado.');

        comentario.comment = comment;
        comentario.user = idUsuarioLogado;
        comentario.post = id;


        const newComment = await this.ormRepositoryComments.create(comentario);

        const newComentUserLogado = await this.ormRepositoryComments.save(newComment);
        newComentUserLogado.user_id = user;

        return newComentUserLogado;


    }

    public async deletar(id: string): Promise<void> {


        const idComments = await this.ormRepositoryComments.findOne({
            where: { id }
        });


        if (!idComments)
            throw new Error('Não existe id para esse comentario');


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