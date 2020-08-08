import { Repository, getRepository } from 'typeorm';
import path from 'path';
import { sign } from 'jsonwebtoken';
import User from '../models/User';
import HashPassword from '../service/HashPassword';
import authTokenReset from '../../../config/authTokenReset';

interface Request {
    email: string;
}

class ForgotPassword {

    private ormRepository: Repository<User>;

    constructor() {
        this.ormRepository = getRepository(User);


    }


    public async execute({ email }: Request): Promise<any> {

        const user = await this.ormRepository.findOne({ where: { email } });

        if (!user) {

            throw new Error('Usuario nao encontrado');
        }

        console.log('4');


        const { secret, expiresIn } = authTokenReset.jwt;

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        });

        console.log('token', `http://localhost:3000/${token}`);

        // const templateForgot = path.resolve(__dirname, '..', 'view', 'forgot_password.hbs');

        // await this.mailProvider.sendMail({

        // })

        return token;



    }

}

export default ForgotPassword;