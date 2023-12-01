import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

/**
 * Validator constraint that checks if a string value meets the criteria of a strong password.
 */
@ValidatorConstraint({name: "IsStrong", async: true})
@Injectable()
export class IsStrong implements ValidatorConstraintInterface {
    /**
     * Validates if the provided value is a strong password.
     * @param {string} value - The value to be validated.
     * @param {ValidationArguments} validationArguments - Additional validation arguments (optional).
     * @returns {boolean | Promise<boolean>} - A boolean indicating whether the value is a strong password.
     */
    validate(value: string, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
        /**
         * regex to check if the password contains atleast a character and a digit
         */
        const reg = /^(?=.*[a-zA-Z])(?=.*[0-9]).+$/ 
        return reg.test(value)
    }

    /**
     * Returns the default error message when the value is not a strong password.
     * @param {ValidationArguments} validationArguments - Additional validation arguments (optional).
     * @returns {string} - The default error message.
     */
    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'password is not strong enough'
    }
}