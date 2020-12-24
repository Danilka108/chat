import { IsNotEmpty, Validate, MinLength, MaxLength, IsString } from 'class-validator'
import { IsEmail } from '../validator/is-email.validator'

export class CreateUserDto {
    @IsNotEmpty()
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
    @MinLength(8)
    @MaxLength(100)
    @IsString()
    readonly password!: string
}
