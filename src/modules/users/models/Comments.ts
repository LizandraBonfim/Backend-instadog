import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import User from './User';

@Entity('comments')
class Comments {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    comment: string;

    @Column()
    user: string;

    @Column()
    post: string;

    @OneToOne(() => User)
    @JoinColumn({ name: 'user' })
    user_id: User;

}

export default Comments;