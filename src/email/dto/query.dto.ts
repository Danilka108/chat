import { IsNotEmpty, IsNumberString } from 'class-validator'

export class QueryDto {
    @IsNotEmpty()
    @IsNumberString()
    readonly id!: number

    @IsNotEmpty()
    readonly token!: string
}
