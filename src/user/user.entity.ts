import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm'
import * as bcrypt from 'bcrypt'

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    email!: string

    @Column()
    password!: string

    @Column({
        default: '',
    })
    bio!: string

    @Column()
    is_deleted!: boolean

    @BeforeInsert()
    async hashPassword(): Promise<void> {
        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)
        this.password = await bcrypt.hash(this.password, salt)
    }
}
