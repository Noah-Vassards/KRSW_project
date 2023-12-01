import { Injectable, ArgumentMetadata, BadRequestException, ValidationPipe } from '@nestjs/common';

/**
 * A custom validation pipe that extends the `ValidationPipe` class.
 * It handles validation errors and throws a custom exception for bad user credentials.
 */
@Injectable()
export class ValidateInputPipe extends ValidationPipe {
   /**
    * Transforms the input value based on the provided metadata.
    * @param {any} value - The input value to transform.
    * @param {ArgumentMetadata} metadata - The metadata about the argument being validated.
    * @returns {Promise<any>} - A promise resolving to the transformed value.
    * @throws {CustomBadRequestException} - Throws a custom exception for bad user credentials.
    */
   public async transform(value, metadata: ArgumentMetadata) {
      try {
        return await super.transform(value, metadata);
      } catch (e) {
         if (e instanceof BadRequestException) {
            throw new CustomBadRequestException(this.handleError("Bad user credentials"));
         }
         throw e;
      }
   }

   /**
    * Handles the error and returns the error message.
    * @param {any} errors - The validation errors.
    * @returns {any} - The error message.
    */
   private handleError(errors) {
        return errors;
   }
}

/**
 * A custom exception class that extends the `BadRequestException` class.
 * It can be used to throw a custom exception for bad request with a specific message.
 */
export class CustomBadRequestException extends BadRequestException {
   /**
    * Creates an instance of the custom bad request exception.
    * @param {string | object | any} message - The exception message.
    * @param {string} error - The error details (optional).
    */
   constructor(message?: string | object | any, error?: string) {
     super(message, error);
   }
 }