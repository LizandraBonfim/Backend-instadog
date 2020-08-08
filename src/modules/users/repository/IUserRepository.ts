import User from "../models/User";

export default interface IUserRepository {
    findById(id: string): Promise<User | undefined>;
    findByEmail(email: string): Promise<User | undefined>;
    findByName(name: string): Promise<User | undefined>;
    create(name: string, email: string, password: string): Promise<User>;
    save(user: User): Promise<User>;
}