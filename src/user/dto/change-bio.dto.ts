import { IsDefined, IsString, MaxLength } from 'class-validator'

export class ChangeBioDto {
    @IsDefined()
    @MaxLength(100)
    @IsString()
    readonly newBio!: string
}
