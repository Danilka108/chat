import { User } from 'src/user/user.entity'
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity('messages_dialogs')
export class MessageDialog {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => User)
    interlocutor_1!: User

    @ManyToOne(() => User)
    interlocutor_2!: User
}
