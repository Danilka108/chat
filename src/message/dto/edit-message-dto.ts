import { IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { config } from 'src/config'

export class EditMessageDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(config.message.maxLength)
    message!: string
}
