import { IsNotEmpty, IsString, MaxLength, MinLength, Validate } from 'class-validator'
import { IsName } from '../validator/is-name.validator'

export class EditNameDto {
    @IsNotEmpty()
    @Validate(IsName)
    @MinLength(2)
    @MaxLength(20)
    @IsString()
    readonly newName!: string
}
