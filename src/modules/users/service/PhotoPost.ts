import { Repository, getRepository } from 'typeorm';
import User from '../models/User';
import Photos from '../models/Photos';

interface Request {
    id: string;
    nome: string;
    idade: number;
    peso: number;
    avatar: string;
}

class PhotoPost {

    private ormRepositoryAvatar: Repository<Photos>;
    private ormRepositoryUser: Repository<User>;

    constructor() {
        this.ormRepositoryAvatar = getRepository(Photos);
        this.ormRepositoryUser = getRepository(User);
    }


    public async postar({ id, avatar, idade, peso, nome }: Request): Promise<any> {

        const post = new Photos();

        const user = await this.ormRepositoryUser.findOne({
            where: { id }
        });

        if (!user)
            throw new Error('Para postar fotos, favor realizar logon');

        post.idade = idade;
        post.peso = peso;
        post.nome = nome;
        post.photo = avatar;
        post.user = user.id;

        const newPost = await this.ormRepositoryAvatar.create(post);


        const novoPost = await this.ormRepositoryAvatar.save(newPost);

        return novoPost;


    }
    public async deletar(id: string): Promise<void> {


        const userpost = await this.ormRepositoryAvatar.findOne({
            where: { id }
        });


        if (!userpost)
            throw new Error('Não existe id para essa foto');


        const user = await this.ormRepositoryUser.findOne({
            where: { id: userpost.user }
        });

        if (!user)
            throw new Error('Para deletar foto, é necessario estar logado');


        if (userpost.user !== user.id) {
            throw new Error('Não é possivel deletar foto de outro usuario');
        }

        await this.ormRepositoryAvatar.delete({ id: userpost.id });


    }



}

export default PhotoPost;