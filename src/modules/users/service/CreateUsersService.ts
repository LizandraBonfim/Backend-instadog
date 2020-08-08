import { Repository, getRepository } from 'typeorm';
import User from '../../users/models/User';
import HashPassword from './HashPassword';
import IUserRepository from '../repository/IUserRepository';


class CreateUsersService implements IUserRepository {

    private ormRepository: Repository<User>;
    private hashProvider: HashPassword;

    constructor() {
        this.ormRepository = getRepository(User);
        this.hashProvider = new HashPassword();
    }


    public async findByEmail(email: string): Promise<User | undefined> {
        const find = await this.ormRepository.findOne({
            where: { email }
        });

        if (find) {
            throw new Error('Já possui um usuario com esse email');
        }


        return find;
    }

    public async findByName(name: string): Promise<User | undefined> {
        const find = await this.ormRepository.findOne({
            where: { name }
        });

        if (find) {
            throw new Error('Já possui um usuario com esse username');
        }


        return find;
    }


    public async findById(id: string): Promise<User | undefined> {
        const find = await this.ormRepository.findOne({
            where: { id }
        });

        return find;

    }

    public async create(name: string, email: string, password: string): Promise<User> {
        let user = new User();

        const hashedPassword = await this.hashProvider.generate(password);

        user = this.ormRepository.create({ name, email, password: hashedPassword });

        return user;
    }

    public async save(user: User): Promise<User> {
        const createUser = this.ormRepository.save(user);

        return createUser;
    }

}

export default CreateUsersService;