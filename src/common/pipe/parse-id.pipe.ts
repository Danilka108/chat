import { BadRequestException, PipeTransform } from '@nestjs/common'
import { validationPipeErrorMessage } from './validation-pipe-error-message'

export class ParseIDPipe implements PipeTransform<string, number> {
    transform(value: string) {
        const val = parseInt(value)

        if (isNaN(val)) {
            throw new BadRequestException(validationPipeErrorMessage)
        }

        if (val < 1) {
            throw new BadRequestException(validationPipeErrorMessage)
        }

        return val
    }
}
