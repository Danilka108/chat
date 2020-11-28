import { IsNotEmpty, IsNumberString } from 'class-validator'

export class ConfirmQueryDto {
    @IsNotEmpty()
    @IsNumberString()
    readonly userID!: number

    @IsNotEmpty()
    readonly confirmToken!: string
}
