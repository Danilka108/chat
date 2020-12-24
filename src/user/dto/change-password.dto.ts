import { IsNotEmpty, MinLength, MaxLength, IsString } from 'class-validator'

export class ChangePasswordDto {
    @IsNotEmpty()
    readonly oldPassword!: string

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(100)
    @IsString()
    readonly newPassword!: string
}
