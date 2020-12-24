import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class ChangeNameDto {
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(20)
    @IsString()
    readonly newName!: string
}
