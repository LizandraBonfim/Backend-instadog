import { Repository, getRepository } from 'typeorm';
import User from '../models/User';
import HashPassword from '../service/HashPassword';


class ResetPassword {

    private hashProvider: HashPassword;
    private ormRepository: Repository<User>;

    constructor() {
        this.hashProvider = new HashPassword();
        this.ormRepository = getRepository(User);

    }


    public async execute(password: string, id: string): Promise<User> {

        const user = await this.ormRepository.findOne({ where: { id } });

        if (!user) {

            throw new Error('Usuário nao encontrado');
        }

        if (id === user.id) {

            user.password = password;

            if (password) {
                user.password = await this.hashProvider.generate(password);
            }

        }

        return this.ormRepository.save(user);
    }

}

export default ResetPassword;