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


        const { secret, expiresIn } = authTokenReset.jwt;

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        });

        return token;



    }

}

export default ForgotPassword;