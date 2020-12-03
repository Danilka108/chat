import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'

@ValidatorConstraint({ name: 'isPassword', async: false })
export class IsPassword implements ValidatorConstraintInterface {
    validate(text: string) {
        const regexp: RegExp = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})')
        return regexp.test(text)
    }
}
