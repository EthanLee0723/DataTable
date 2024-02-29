import { Entity, Column, PrimaryGeneratedColumn,UpdateDateColumn, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    full_name: string;

    @Column()
    email: string;

    @Column()
    date_of_birth: Date;

    @Column()

    password: string;
    
    @Column()
    created_at: string;

    @UpdateDateColumn()
    updated_at: Date;

    @Column()
    deleted_at: Date;

    @BeforeInsert()
    hashPassword()
    {
        const hashedPassword = bcrypt.hashSync(this.password, 10); 
        this.password = hashedPassword;
    }
}