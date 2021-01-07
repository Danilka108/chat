import { Body, Controller, Post, HttpCode, HttpStatus, Delete, UseGuards } from '@nestjs/common'
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

@Controller('api/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    async create(@Body() createUserDto: CreateUserDto) {
        await this.userService.create(createUserDto)

        return {
            statusCode: HttpStatus.OK,
            message: 'User created. Please confirm your email to complete registration',
        }
    }

    @Post('check-email')
    @HttpCode(HttpStatus.OK)
    async checkEmail(@Body() checkEmailDto: CheckEmailDto) {
        await this.userService.checkEmail(checkEmailDto)

        return {
            statusCode: HttpStatus.OK,
            message: 'Email can be used',
        }
    }

    @Post('change/password')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Decoded() decoded: IDecoded) {
        await this.userService.changePassword(changePasswordDto, decoded)

        return {
            statusCode: HttpStatus.OK,
            message: 'User password changed',
        }
    }

    @Post('change/name')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async changeName(@Body() changeNameDto: ChangeNameDto, @Decoded() decoded: IDecoded) {
        await this.userService.changeName(changeNameDto, decoded)

        return {
            statusCode: HttpStatus.OK,
            message: 'User name changed',
        }
    }

    @Post('change/bio')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async changeBio(@Body() changeBioDto: ChangeBioDto, @Decoded() decoded: IDecoded) {
        await this.userService.changeBio(changeBioDto, decoded)

        return {
            statusCode: HttpStatus.OK,
            message: 'User bio changed',
        }
    }

    @Post('change/email')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async changeEmail(@Body() changeEmailDto: ChangeEmailDto, @Decoded() decoded: IDecoded) {
        await this.userService.changeEmail(changeEmailDto, decoded)

        return {
            statusCode: HttpStatus.OK,
            message: 'A link to complete the email change has been sent to the new email address',
        }
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        await this.userService.resetPassword(resetPasswordDto)

        return {
            statusCode: HttpStatus.OK,
            message: 'If the user is registered with this email address, the email will be sent to this email address',
        }
    }

    @Delete()
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async delete(@Body() deleteUserDto: DeleteUserDto, @Decoded() decoded: IDecoded) {
        await this.userService.delete(deleteUserDto, decoded)

        return {
            statusCode: HttpStatus.OK,
            message: 'User deleted',
        }
    }
}
