import { sign } from 'jsonwebtoken';
import { getRepository, Repository } from 'typeorm';

import User from "../models/User";
import HashPassword from "../service/HashPassword";
import authToken from "../../../config/authToken";


interface Request {
    email: string;
    password: string;
}

interface Response {
    user: User;
    token: string;
}

class Authenticate {

    private hashProvider: HashPassword;
    private ormRepository: Repository<User>;


    constructor() {
        this.hashProvider = new HashPassword();
        this.ormRepository = getRepository(User);

    }

    public async execute({ email, password }: Request): Promise<Response> {
        console.log('email senha', {
            email, password
        });

        const user = await this.ormRepository.findOne({ where: { email } });


        console.log('usuarioo0', user);

        if (!user) {
            throw new Error('Dados incorretos, favor verificar.');
        }

        const passwordMatched = await this.hashProvider.compareHash(password, user.password);

        if (!passwordMatched) {
            throw new Error('Dados incorretos, favor verificar.');
        }

        const { secret, expiresIn } = authToken.jwt;

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        });

        console.log('token', token)

        return { user, token };
    }
}

export default Authenticate;