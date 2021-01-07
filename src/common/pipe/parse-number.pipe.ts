import { BadRequestException, PipeTransform } from '@nestjs/common'
import { validationPipeErrorMessage } from './validation-pipe-error-message'

export class ParseNumberPipe implements PipeTransform<string, number> {
    transform(value: string, _: any) {
        const val = parseInt(value)

        if (isNaN(val)) {
            throw new BadRequestException(validationPipeErrorMessage)
        }

        if (val < 0) {
            throw new BadRequestException(validationPipeErrorMessage)
        }

        return val
    }
}
