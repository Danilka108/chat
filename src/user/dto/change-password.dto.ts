import { IsNotEmpty, Validate, MinLength, MaxLength, IsString } from 'class-validator'
import { IsPassword } from '../validator/is-password.validator'

export class ChangePasswordDto {
    @IsNotEmpty()
    readonly oldPassword!: string

    @IsNotEmpty()
    @Validate(IsPassword)
    @MaxLength(100)
    @IsString()
    readonly newPassword!: string
}
