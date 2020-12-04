import { IsNotEmpty, IsString, MaxLength, Validate } from 'class-validator'
import { IsEmail } from '../validator/is-email.validator'

export class ChangeEmailDto {
    @IsNotEmpty()
    readonly password!: string

    @IsNotEmpty()
    @Validate(IsEmail)
    @MaxLength(254)
    @IsString()
    readonly newEmail!: string
}
