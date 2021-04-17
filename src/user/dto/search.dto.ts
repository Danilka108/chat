import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class SearchDto {
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(20)
    @IsString()
    readonly name!: string
}
