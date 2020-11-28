import {
    BadRequestException,
    Controller,
    Get,
    HttpCode,
    Query,
} from '@nestjs/common'
import { HttpStatus } from '@nestjs/common/enums/http-status.enum'
import { ConfirmQueryDto } from './dto/confirm-query.dto'
import { EmailService } from './email.service'

@Controller('api/email')
export class EmailController {
    constructor(private readonly emailService: EmailService) {}

    @Get('confirm')
    @HttpCode(HttpStatus.OK)
    async confirm(@Query() queries: ConfirmQueryDto) {
        await this.emailService.confirm(queries.userID, queries.confirmToken)

        return {
            statusCode: HttpStatus.OK,
            message: 'email confirmed successfully',
        }
    }
}
