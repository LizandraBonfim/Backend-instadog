import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
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

    // @ManyToOne(() => User)
    // @JoinColumn({ name: 'user' })
    // user: User;

}

export default Comments;