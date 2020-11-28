import { IsNotEmpty, IsString } from 'class-validator'

export class LoginDto {
    @IsNotEmpty()
    @IsString()
    readonly email!: string

    @IsNotEmpty()
    @IsString()
    readonly password!: string

    @IsNotEmpty()
    @IsString()
    readonly os!: string

    @IsNotEmpty()
    @IsString()
    readonly browser!: string
}
