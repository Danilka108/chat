import { Content } from 'src/content/content.entity'
import { User } from 'src/user/user.entity'
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn()
    id!: number

    @OneToOne(() => Content)
    @JoinColumn()
    content!: Content

    @ManyToOne(() => User)
    sender!: User

    @ManyToOne(() => User)
    receiver!: User

    @Column({
        default: false,
    })
    is_updated!: boolean

    @CreateDateColumn({
        type: 'timestamp with time zone'
    })
    createdAt!: string

    @UpdateDateColumn({
        type: 'timestamp with time zone'
    })
    updatedAt!: string
}
