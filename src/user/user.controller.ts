import { Body, Controller, Post, HttpCode, HttpStatus, Delete, UseGuards, Get } from '@nestjs/common'
import { Decoded } from 'src/common/decorator/decoded.decorator'
import { AuthGuard } from 'src/common/guard/auth.guard'
import { IDecoded } from 'src/common/interface/decoded.interface'
import { CreateUserDto } from './dto/create-user.dto'
import { DeleteUserDto } from './dto/delete-user.dto'
import { EditBioDto } from './dto/edit-bio.dto'
import { EditNameDto } from './dto/edit-name.dto'
import { UserService } from './user.service'

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

    @Get('edit/password')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async editPassword(@Decoded() decoded: IDecoded) {
        await this.userService.editPassword(decoded)

        return {
            statusCode: HttpStatus.OK,
            message: 'A link to reset your password has been sent to your email',
        }
    }

    @Post('edit/name')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async editName(@Body() editNameDto: EditNameDto, @Decoded() decoded: IDecoded) {
        await this.userService.editName(editNameDto, decoded)

        return {
            statusCode: HttpStatus.OK,
            message: 'User name changed',
        }
    }

    @Post('edit/bio')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async editBio(@Body() editBioDto: EditBioDto, @Decoded() decoded: IDecoded) {
        await this.userService.editBio(editBioDto, decoded)

        return {
            statusCode: HttpStatus.OK,
            message: 'User bio changed',
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
