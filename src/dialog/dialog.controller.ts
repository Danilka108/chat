import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common'
import { Decoded } from 'src/common/decorator/decoded.decorator'
import { AuthGuard } from 'src/common/guard/auth.guard'
import { IDecoded } from 'src/common/interface/decoded.interface'
import { DialogService } from './dialog.service'

@Controller('api/dialog')
export class DialogController {
    constructor(private readonly dialogService: DialogService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async getDialogs(@Decoded() decoded: IDecoded) {
        const dialogs = await this.dialogService.getDialogs(decoded)

        return {
            statusCode: HttpStatus.OK,
            message: 'dialogs found',
            data: dialogs,
        }
    }
}
