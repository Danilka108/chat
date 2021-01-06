import { IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { config } from 'src/config'

export class SendMessageDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(config.message.maxLength)
    message!: string
}
