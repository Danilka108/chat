import { Body, Controller, HttpCode, HttpStatus, Ip, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { ILoginResponse } from './response/login.response'
import { IRefreshTokenResponse } from './response/refresh-token.response'

@Controller('/api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto, @Ip() ip: string): Promise<ILoginResponse> {
        const result = await this.authService.login(loginDto, ip)

        return {
            statusCode: HttpStatus.OK,
            message: 'Authentication complited',
            data: result,
        }
    }

    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDto, @Ip() ip: string): Promise<IRefreshTokenResponse> {
        const result = await this.authService.refreshToken(refreshTokenDto, ip)

        return {
            statusCode: HttpStatus.OK,
            message: 'Token refreshed',
            data: result,
        }
    }
}
