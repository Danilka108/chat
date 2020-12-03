import { Body, Controller, HttpCode, HttpStatus, Ip, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'

@Controller('/api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto, @Ip() ip: string) {
        const result = await this.authService.login(loginDto, ip)

        return {
            statusCode: HttpStatus.OK,
            mesage: 'Authentication complited successfully',
            data: result,
        }
    }

    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDto, @Ip() ip: string) {
        const result = await this.authService.refreshToken(refreshTokenDto, ip)

        return {
            statusCode: HttpStatus.OK,
            message: 'Token refreshed successfully',
            data: result,
        }
    }
}
