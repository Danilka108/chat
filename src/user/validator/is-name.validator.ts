import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'

@ValidatorConstraint({ name: 'isName', async: false })
export class IsName implements ValidatorConstraintInterface {
    validate(text: string) {
        const regexp: RegExp = new RegExp('^[a-zA-Z ]+$')
        return regexp.test(text)
    }
}
