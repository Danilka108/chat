import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class ResetPasswordDto {
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(254)
    @IsString()
    readonly email!: string
}
