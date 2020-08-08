import { hash, compare } from 'bcryptjs';

class HashPassword {
    public async generate(payload: string): Promise<string> {
        return await hash(payload, 8);
    }

    public async compareHash(payload: string, hashed: string): Promise<boolean> {
        return await compare(payload, hashed);
    }
}

export default HashPassword;