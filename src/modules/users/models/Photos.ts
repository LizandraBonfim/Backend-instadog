import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import User from './User';

@Entity('photos')
class Photos {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nome: string;

    @Column()
    photo: string;

    @Column()
    idade: number;

    @Column()
    peso: number;

    @Column()
    acessos: number;

    @Column()
    user: string;

    // @ManyToOne(() => User)
    // @JoinColumn({ name: 'user' })
    // user: User;

}

export default Photos;