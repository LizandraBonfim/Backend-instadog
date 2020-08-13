import { Router, NextFunction, Request, Response } from 'express';
import { createConnection } from 'typeorm';
import { Joi, celebrate, Segments } from 'celebrate';
import { verify } from 'jsonwebtoken';
import multer from 'multer';
import CreateUsersRepository from './repository/CreateUsersRepository';
import Authenticate from './authenticate/Authenticate';
import UpdateProfile from './repository/UpdateProfile';
import ForgotPassword from './repository/ForgotPassword';
import authTokenReset from '../../config/authTokenReset';
import Upload from '../../config/Upload';
import ResetPassword from './repository/ResetPassword';
import ensureAuthenticate from './authenticate/EnsureAuthenticate';
import PhotoPost from './service/PhotoPost';
import CommentsPost from './repository/CommentsPost';
import Feed from './repository/Feed';
import FeedUserPhoto from './repository/UserPhoto';
import FeedUser from './repository/FeedUser';
import UserPhoto from './repository/UserPhoto';

createConnection();

const routerUsers = Router();
const upload = multer(Upload);


routerUsers.post('/users', celebrate({
    [Segments.BODY]: Joi.object({

        name: Joi.string().min(6).required().error(new Error('Minimo 6 caracteres')),
        email: Joi.string().email().required().error(new Error('Email é obrigatório!')),
        password: Joi.string().min(6).required().error(new Error('Minimo 6 caracteres')),
    })
}), async (req: Request, res: Response, next: NextFunction) => {

    try {

        const { name, email, password } = req.body;

        const createUsers = new CreateUsersRepository()

        const response = await createUsers.create(name, email, password);

        console.log('response', response)

        res.status(201).json(response);


    } catch (error) {
        res.status(403).json({ message: error.message });

    } finally {
        return next();

    }

});

routerUsers.put('/profile/:id', ensureAuthenticate, celebrate({
    [Segments.BODY]: Joi.object({

        name: Joi.string().min(6).error(new Error('Minimo 6 caracteres')),
        password: Joi.string().min(6).error(new Error('Minimo 6 caracteres')),
    })
}), async (req: Request, res: Response, next: NextFunction) => {
    const { name, password } = req.body;
    const { id } = req.params;

    try {

        const updateUser = new UpdateProfile();
        const user = await updateUser.update({ id, name, password });

        return res.status(200).json(user);

    } catch (error) {
        return res.status(403).json({ message: error.message });


    } finally {
        return next();
    }


});

routerUsers.post('/forgot', celebrate({
    [Segments.BODY]: Joi.object({
        email: Joi.string().email().required()
    })
}), async (req: Request, res: Response, next: NextFunction) => {

    try {

        const { email } = req.body;

        const forgotPassword = new ForgotPassword();


        const token = await forgotPassword.execute({ email });
        console.log('email request', token)

        if (!token) {
            throw new Error('Token não validado')
        }

        return res.json(token);
    } catch (error) {
        return res.status(403).json('Não foi possivel enviar e-mail de reset.');

    } finally {
        return next();
    }

});

routerUsers.post('/sessions', celebrate({
    [Segments.BODY]: Joi.object({

        email: Joi.string().email().required().error(new Error('Email invalido')),
        password: Joi.string().min(6).required().error(new Error('Senha inválida')),

    })
}), async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { email, password } = req.body;

        const authenticate = new Authenticate();

        const { user, token } = await authenticate.execute({ email, password });

        return res.json({ user, token });

    } catch (error) {

        return res.status(403).json({ message: error.message });

    } finally {
        return next();
    }

});

routerUsers.post('/reset/:id/token/:token', celebrate({
    [Segments.BODY]: {
        password: Joi.string().min(6).error(new Error('Min 6 caracteres'))
    }
}), async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { id, token } = req.params;
        const { password } = req.body;

        if (!token) return res.status(403).json({ message: 'Token invalido' });

        const reset = new ResetPassword();

        const user = await reset.execute(password, id);

        console.log(user);

        const decoded = verify(token, authTokenReset.jwt.secret);
        console.log('decoded::: ', decoded);


        return res.json({ message: 'Senha alterada com sucesso.' });

    } catch (error) {
        return res.status(403).json({ message: error.message });


    } finally {
        return next();
    }

});

routerUsers.post('/post', upload.single('avatar'), ensureAuthenticate,
    async (req: Request, res: Response, next: NextFunction) => {

        try {

            const { nome, idade, peso } = req.body;

            const id = req.headers.id;

            if (!id) return res.json('Você não está logado.');

            const avatar = req.file.filename;

            const photoPost = new PhotoPost();

            await photoPost.postar({ id: String(id), avatar, idade, peso, nome });
            console.log(photoPost);

            return res.status(201).json({ message: 'Enviado' });

        } catch (error) {
            return res.status(403).json({ message: 'Não foi possivel postar foto' });
        } finally {
            return next();
        }

    });

routerUsers.delete('/delete/:id', ensureAuthenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const photoPost = new PhotoPost();
        await photoPost.deletar(id);

        return res.status(200).json('Post deletado');


    } catch (error) {
        return res.status(303).json({ message: error.message });
    } finally {
        return next();
    }
});

routerUsers.post('/comments/:id', ensureAuthenticate, async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { id } = req.params;

        const idUsuarioLogado = req.headers.id as string;

        console.log('Foto', id);

        console.log('idUsuarioLogado', idUsuarioLogado)

        const { comment } = req.body;

        console.log(`id ${id} : Coments ${comment}`)

        const comentario = new CommentsPost();

        const lizandra = await comentario.postar(id, comment, idUsuarioLogado);

        return res.status(200).json(lizandra);


    } catch (error) {
        return res.status(303).json({ message: error.message });

    } finally {
        return next();
    }
})

routerUsers.delete('/comments/delete/:id', ensureAuthenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { id } = req.params;

        const comentario = new CommentsPost();

        await comentario.deletar(id);

        return res.json('Comentario deletado.')


    } catch (error) {
        return res.status(403).json({ message: error.message });
    } finally {
        return next();
    }
});

routerUsers.get('/feed', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, items, user } = req.query;

        const newPage = Number(page);
        const newItem = Number(items);

        const feed = new Feed();

        const pages = await feed.execute({ page: newPage, items: newItem, user: user as string });

        return res.json(pages);


    } catch (error) {
        return res.status(500).json({ message: error.message });
    } finally {
        return next();
    }
});

routerUsers.get('/feed/photo/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { id } = req.params;

        const photo = new UserPhoto();

        const pages = await photo.execute(id);

        return res.json(pages);


    } catch (error) {
        return res.status(403).json({ message: error.message });
    } finally {
        return next();
    }
});

routerUsers.get('/photos/user/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { page, items } = req.query;

        const { id } = req.params;
        const newPage = Number(page);
        const newItem = Number(items);

        const feedUser = new FeedUser();

        const user = await feedUser.execute(id, newPage, newItem);

        return res.json(user);


    } catch (error) {
        return res.status(403).json({ message: error.message });
    } finally {
        return next();
    }
});

routerUsers.get('/conta/myphotos', ensureAuthenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { page, items } = req.query;

        const id = req.headers.id;

        if (!id) return res.json('Você não está logado.');

        const newPage = Number(page);
        const newItem = Number(items);

        const feed = new Feed();

        const pages = await feed.execute({ page: newPage, items: newItem, user: id as string });

        return res.json(pages);


    } catch (error) {
        return res.status(403).json({ message: error.message });
    } finally {
        return next();
    }
});

export default routerUsers; 