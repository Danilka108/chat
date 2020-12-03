import { IsNotEmpty, Validate, MinLength, MaxLength, IsString } from 'class-validator'
import { IsEmail } from '../validator/is-email.validator'
import { IsPassword } from '../validator/is-password.validator'
import { IsName } from '../validator/is-name.validator'

export class CreateUserDto {
    @IsNotEmpty()
    @Validate(IsName)
    @MinLength(2)
    @MaxLength(20)
    @IsString()
    readonly name!: string

    @IsNotEmpty()
    @Validate(IsEmail)
    @MaxLength(254)
    @IsString()
    readonly email!: string

    @IsNotEmpty()
    @Validate(IsPassword)
    @MaxLength(100)
    @IsString()
    readonly password!: string
}
