import { IsString } from 'class-validator'

export class SearchDto {
    @IsString()
    readonly name!: string
}
