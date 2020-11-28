import { IsString, IsNumber, IsNotEmpty } from 'class-validator'

export class RefreshTokenDto {
    @IsNotEmpty()
    @IsNumber()
    readonly userID!: number

    @IsNotEmpty()
    @IsString()
    readonly refreshToken!: string

    @IsNotEmpty()
    @IsString()
    readonly os!: string

    @IsNotEmpty()
    @IsString()
    readonly browser!: string
}
