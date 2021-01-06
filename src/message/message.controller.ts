import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common'
import { Decoded } from 'src/common/decorator/decoded.decorator'
import { AuthGuard } from 'src/common/guard/auth.guard'
import { IDecoded } from 'src/common/interface/decoded.interface'
import { ParseIDPipe } from 'src/common/pipe/parse-id.pipe'
import { EditMessageDto } from './dto/edit-message-dto'
import { SendMessageDto } from './dto/send-message.dto'
import { MessageService } from './message.service'

@Controller('api/message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async getAllMessages(@Param('id', ParseIDPipe) id: number, @Decoded() decoded: IDecoded) {
        const messages = await this.messageService.getAllMessages(id, decoded)

        return {
            statusCode: 200,
            message: 'All messages found',
            data: messages,
        }
    }

    @Post(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async sendMessage(
        @Param('id', ParseIDPipe) id: number,
        @Body() sendMessageDto: SendMessageDto,
        @Decoded() decoded: IDecoded
    ) {
        const message = await this.messageService.sendMessage(id, sendMessageDto, decoded)

        return {
            statusCode: 200,
            message: 'Message sent',
            data: {
                messageID: message.id,
            },
        }
    }

    @Put()
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async updateMessage(
        @Query('message-id', ParseIDPipe) messageID: number,
        @Body() editMessageDto: EditMessageDto,
        @Decoded() decoded: IDecoded
    ) {
        await this.messageService.updateMessage(editMessageDto, messageID, decoded)

        return {
            statusCode: 200,
            message: 'Message edited',
        }
    }

    @Delete()
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async deleteMessage(@Query('message-id', ParseIDPipe) messageID: number, @Decoded() decoded: IDecoded) {
        await this.messageService.deleteMessage(messageID, decoded)

        return {
            statusCode: 200,
            message: 'Message deleted',
        }
    }
}
