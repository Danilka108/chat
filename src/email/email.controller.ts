import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common'
import { HttpStatus } from '@nestjs/common/enums/http-status.enum'
import { QueryDto } from './dto/query.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { EmailService } from './email.service'

@Controller('api/email')
export class EmailController {
    constructor(private readonly emailService: EmailService) {}

    @Get('confirm-email')
    @HttpCode(HttpStatus.OK)
    async confirmEmail(@Query() queryDto: QueryDto) {
        await this.emailService.confirmEmail(queryDto)

        return {
            statusCode: HttpStatus.OK,
            message: 'Email confirmed',
        }
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Query() queryDto: QueryDto, @Body() resetPasswordDto: ResetPasswordDto) {
        await this.emailService.resetPassword(resetPasswordDto, queryDto)

        return {
            statusCode: HttpStatus.OK,
            message: 'Password reseted',
        }
    }

    @Get('change-email')
    @HttpCode(HttpStatus.OK)
    async changeEmail(@Query() queryDto: QueryDto) {
        await this.emailService.changeEmail(queryDto)

        return {
            statusCode: HttpStatus.OK,
            message: 'Email changed',
        }
    }
}
