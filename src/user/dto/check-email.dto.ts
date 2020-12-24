import { IsNotEmpty, IsString, MaxLength, Validate } from 'class-validator'
import { IsEmail } from '../validator/is-email.validator'

export class CheckEmailDto {
    @IsNotEmpty()
    @Validate(IsEmail)
    @MaxLength(254)
    @IsString()
    email!: string
}
