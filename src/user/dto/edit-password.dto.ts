import {
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
    Validate,
} from 'class-validator'
import { IsPassword } from '../validator/is-password.validator'

export class EditPasswordDto {
    @IsNotEmpty()
    @IsString()
    readonly oldPassword!: string

    @IsNotEmpty()
    @Validate(IsPassword)
    @MaxLength(100)
    @IsString()
    readonly newPassword!: string
}
