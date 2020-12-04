import { IsNotEmpty, IsString, MaxLength, Validate } from 'class-validator'
import { IsEmail } from '../validator/is-email.validator'

export class ResetPasswordDto {
    @IsNotEmpty()
    @Validate(IsEmail)
    @MaxLength(254)
    @IsString()
    readonly email!: string
}
