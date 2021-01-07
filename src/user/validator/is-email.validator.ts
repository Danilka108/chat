import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'

@ValidatorConstraint({ name: 'isEmail', async: false })
export class IsEmail implements ValidatorConstraintInterface {
    validate(text: string) {
        const regexp = new RegExp('@')
        return regexp.test(text)
    }
}
