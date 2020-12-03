import { IsNotEmpty, IsString, MaxLength, Validate } from 'class-validator'
import { IsPassword } from 'src/user/validator/is-password.validator'

export class ResetPasswordDto {
    @IsNotEmpty()
    readonly oldPassword!: string

    @IsNotEmpty()
    @Validate(IsPassword)
    @MaxLength(100)
    @IsString()
    readonly newPassword!: string
}
