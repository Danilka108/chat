import { IsDefined, IsString, MaxLength } from 'class-validator'

export class EditBioDto {
    @IsDefined()
    @MaxLength(100)
    @IsString()
    readonly newBio!: string
}
