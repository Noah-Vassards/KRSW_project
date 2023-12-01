import { ArgumentMetadata, BadRequestException, ValidationPipe } from "@nestjs/common";
import { CustomBadRequestException, ValidateInputPipe } from "./validate.pipe"


class UserDto {

}

describe('validate pipe', () => {
    let validateInputPipe: ValidateInputPipe

    beforeEach(() => {
        validateInputPipe = new ValidateInputPipe();
    })

    it('should be defined', () => {
        expect(validateInputPipe).toBeDefined()
    })

    describe('transform', () => {
        it('should transform', async () => {
            const value = { name: 'test', email: 'test@test.com', password: 'password1' }
            const metadata: ArgumentMetadata = { metatype: UserDto, type: 'body', data: undefined }

            const spyOnSuperMethod = jest.spyOn(ValidationPipe.prototype, "transform")
            spyOnSuperMethod.mockResolvedValue({email: value.email})

            const result = await validateInputPipe.transform(value, metadata)

            expect(spyOnSuperMethod).toHaveBeenCalledWith(value, metadata)

            expect(result).toEqual({email: value.email})
        })

        it('should not transform - CustomBadRequestException', async () => {
            const value = { name: 'test', email: 'test@test.com', password: 'password1' }
            const metadata: ArgumentMetadata = { metatype: UserDto, type: 'body', data: undefined }

            const spyOnSuperMethod = jest.spyOn(ValidationPipe.prototype, "transform")
            spyOnSuperMethod.mockImplementation(() => {
                throw new BadRequestException();
            })

            try {
                await validateInputPipe.transform(value, metadata)
                fail('Expected an exception to be thrown')
            } catch (error) {
                expect(error).toBeInstanceOf(CustomBadRequestException)
                expect(error.message).toBe('Bad user credentials');
            }

            expect(spyOnSuperMethod).toHaveBeenCalledWith(value, metadata)
        })

        it('should not transform - not instance of BadRequestException', async () => {
            const value = { name: 'test', email: 'test@test.com', password: 'password1' }
            const metadata: ArgumentMetadata = { metatype: UserDto, type: 'body', data: undefined }

            const spyOnSuperMethod = jest.spyOn(ValidationPipe.prototype, "transform")
            spyOnSuperMethod.mockImplementation(() => {throw new Error("error")})

            try {
                await validateInputPipe.transform(value, metadata)
                console.log('test')
                fail('Expected an exception to be thrown')
            } catch (error) {
                expect(error).toBeInstanceOf(Error)
                expect(error.message).toBe('error');
            }

            expect(spyOnSuperMethod).toHaveBeenCalledWith(value, metadata)
        })

    })
})