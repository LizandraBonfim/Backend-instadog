import { Repository, getRepository } from 'typeorm';
import User from '../models/User';
import HashPassword from '../service/HashPassword';

interface Request {
    id: string;
    name: string;
    password: string;
}

class UpdateProfile {

    private hashProvider: HashPassword;
    private ormRepository: Repository<User>;

    constructor() {
        this.hashProvider = new HashPassword();
        this.ormRepository = getRepository(User);


    }


    public async update({ id, name, password }: Request): Promise<User> {

        const user = await this.ormRepository.findOne({ where: { id } });

        if (!user) {
            throw new Error('Nao encontrado');
        }
        const findNameExists = await this.ormRepository.findOne({ where: { name } });

        if (findNameExists && findNameExists.id !== id) {
            throw new Error('Username ja esta em uso');
        }

        user.name = name;

        if (password != null) {
            user.password = await this.hashProvider.generate(password);
        }

        return this.ormRepository.save(user);
    }

}

export default UpdateProfile;