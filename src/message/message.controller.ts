import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { Decoded } from 'src/common/decorator/decoded.decorator'
import { AuthGuard } from 'src/common/guard/auth.guard'
import { IDecoded } from 'src/common/interface/decoded.interface'
import { ParseIDPipe } from 'src/common/pipe/parse-id.pipe'
import { ParseNumberPipe } from 'src/common/pipe/parse-number.pipe'
import { EditMessageDto } from './dto/edit-message.dto'
import { SendMessageDto } from './dto/send-message.dto'
import { MessageService } from './message.service'
import { IDeleteMessageResponse } from './response/delete-message.response'
import { IGetMessagesResponse } from './response/get-messages.response'
import { ISendMessageResponse } from './response/send-message.response'
import { IUpdateMessageResponse } from './response/update-message.response'

@Controller('api/message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async getMessages(
        @Param('id', ParseIDPipe) id: number,
        @Query('take', ParseNumberPipe) take: number,
        @Query('skip', ParseNumberPipe) skip: number,
        @Decoded() decoded: IDecoded
    ): Promise<IGetMessagesResponse> {
        const messages = await this.messageService.getMessages(id, take, skip, decoded)

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
    ): Promise<ISendMessageResponse> {
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
    ): Promise<IUpdateMessageResponse> {
        await this.messageService.updateMessage(editMessageDto, messageID, decoded)

        return {
            statusCode: 200,
            message: 'Message edited',
        }
    }

    @Delete()
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async deleteMessage(
        @Query('message-id', ParseIDPipe) messageID: number,
        @Decoded() decoded: IDecoded
    ): Promise<IDeleteMessageResponse> {
        await this.messageService.deleteMessage(messageID, decoded)

        return {
            statusCode: 200,
            message: 'Message deleted',
        }
    }
}
