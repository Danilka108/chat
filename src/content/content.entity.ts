import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('contents')
export class Content {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    text!: string
}
