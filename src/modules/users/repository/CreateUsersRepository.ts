import CreateUsersService from '../service/CreateUsersService';

class CreateUsersRepository {


    public async create(name: string, email: string, password: string): Promise<any> {



        const createUser = new CreateUsersService();

        const findExistsEmail = await createUser.findByEmail(email);

        if (findExistsEmail)
            throw new Error('Já possui um usuario com esse email');

        const findExistsUsername = await createUser.findByName(name);

        console.log('encontrado? ', findExistsUsername);

        if (findExistsUsername)
            throw new Error('Este username já esta em uso.');


        const user = await createUser.create(name, email, password);
        console.log('user', user);

        await createUser.save(user);


    }

}

export default CreateUsersRepository;