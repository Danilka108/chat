import { Body, Controller, Post, HttpCode, HttpStatus, Delete, UseGuards, Get, Param, Query } from '@nestjs/common'
import { Decoded } from 'src/common/decorator/decoded.decorator'
import { AuthGuard } from 'src/common/guard/auth.guard'
import { IDecoded } from 'src/common/interface/decoded.interface'
import { CreateUserDto } from './dto/create-user.dto'
import { DeleteUserDto } from './dto/delete-user.dto'
import { ChangeBioDto } from './dto/change-bio.dto'
import { ChangeNameDto } from './dto/change-name.dto'
import { UserService } from './user.service'
import { ChangeEmailDto } from './dto/change-email.dto'
import { ChangePasswordDto } from './dto/change-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { CheckEmailDto } from './dto/check-email.dto'
import { IBaseResponse } from 'src/common/interface/base-response.interface'
import { ParseIDPipe } from 'src/common/pipe/parse-id.pipe'
import { INameResponse } from './response/name.response'
import { SearchDto } from './dto/search.dto'
import { SearchResponse } from './response/search.response'
import { IsExistResponse } from './response/is-exist.response'

@Controller('api/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('is-exist')
    @HttpCode(HttpStatus.OK)
    async isExistUser(@Query('user-id', ParseIDPipe) userID: number): Promise<IsExistResponse> {
        const isExistUser = await this.userService.isExistUser(userID)

        return {
            statusCode: HttpStatus.OK,
            message: isExistUser ? 'User exist' : 'User not exist',
            data: isExistUser,
        }
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    async create(@Body() createUserDto: CreateUserDto): Promise<IBaseResponse> {
        await this.userService.create(createUserDto)

        return {
            statusCode: HttpStatus.OK,
            message: 'User created. Please confirm your email to complete registration',
        }
    }

    @Delete()
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async delete(@Body() deleteUserDto: DeleteUserDto, @Decoded() decoded: IDecoded): Promise<IBaseResponse> {
        await this.userService.delete(deleteUserDto, decoded)

        return {
            statusCode: HttpStatus.OK,
            message: 'User deleted',
        }
    }

    @Get(':id/name')
    @HttpCode(HttpStatus.OK)
    async getUserName(@Param('id', ParseIDPipe) id: number): Promise<INameResponse> {
        const userName = await this.userService.getName(id)

        return {
            statusCode: 200,
            message: 'User name found',
            data: userName,
        }
    }

    @Post('search')
    @HttpCode(HttpStatus.OK)
    async search(@Body() searchDto: SearchDto, @Decoded() decoded: IDecoded): Promise<SearchResponse> {
        const searchResult = await this.userService.search(searchDto, decoded)

        return {
            statusCode: HttpStatus.OK,
            message: 'Users found',
            data: searchResult,
        }
    }

    @Post('check-email')
    @HttpCode(HttpStatus.OK)
    async checkEmail(@Body() checkEmailDto: CheckEmailDto): Promise<IBaseResponse> {
        await this.userService.checkEmail(checkEmailDto)

        return {
            statusCode: HttpStatus.OK,
            message: 'Email can be used',
        }
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<IBaseResponse> {
        await this.userService.resetPassword(resetPasswordDto)

        return {
            statusCode: HttpStatus.OK,
            message: 'If the user is registered with this email address, the email will be sent to this email address',
        }
    }

    @Post('change/password')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async changePassword(
        @Body() changePasswordDto: ChangePasswordDto,
        @Decoded() decoded: IDecoded
    ): Promise<IBaseResponse> {
        await this.userService.changePassword(changePasswordDto, decoded)

        return {
            statusCode: HttpStatus.OK,
            message: 'User password changed',
        }
    }

    @Post('change/name')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async changeName(@Body() changeNameDto: ChangeNameDto, @Decoded() decoded: IDecoded): Promise<IBaseResponse> {
        await this.userService.changeName(changeNameDto, decoded)

        return {
            statusCode: HttpStatus.OK,
            message: 'User name changed',
        }
    }

    @Post('change/bio')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async changeBio(@Body() changeBioDto: ChangeBioDto, @Decoded() decoded: IDecoded): Promise<IBaseResponse> {
        await this.userService.changeBio(changeBioDto, decoded)

        return {
            statusCode: HttpStatus.OK,
            message: 'User bio changed',
        }
    }

    @Post('change/email')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async changeEmail(@Body() changeEmailDto: ChangeEmailDto, @Decoded() decoded: IDecoded): Promise<IBaseResponse> {
        await this.userService.changeEmail(changeEmailDto, decoded)

        return {
            statusCode: HttpStatus.OK,
            message: 'A link to complete the email change has been sent to the new email address',
        }
    }
}
