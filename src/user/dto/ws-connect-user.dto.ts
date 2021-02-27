import { IsNotEmpty, IsString } from 'class-validator'

export class WsConnectUserDto {
    @IsNotEmpty()
    @IsString()
    readonly os!: string

    @IsNotEmpty()
    @IsString()
    readonly browser!: string
}
