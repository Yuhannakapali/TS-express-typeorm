import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, BeforeInsert } from "typeorm"
import {IsEmail, MinLength, MaxLength} from "class-validator";
import bcrypt from "bcrypt";
import {Exclude} from "class-transformer"

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @MinLength(4, {
        message: "name is too short"
    })
    @MaxLength(15, {
        message: 'name is too long'
    })
    first_name: string

    @Column()
    @MinLength(4, {
        message: "name is too short"
    })
    @MaxLength(15, {
        message: 'name is too long'
    })
    last_name: string

    @Column({
        unique: true
    })
    @IsEmail()
    email: string

    @Exclude()
    @Column()
    @MinLength(4, {
        message: "password is too short"
    })
    @MaxLength(15, {
        message: "password is too long"
    })
    password: string
    
    @Column()
    age: number

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 8)
    }
}