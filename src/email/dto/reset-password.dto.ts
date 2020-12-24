import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class ResetPasswordDto {
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(100)
    @IsString()
    readonly newPassword!: string
}
