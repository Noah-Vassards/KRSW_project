import { BadRequestException } from "@nestjs/common";
import { LocalStrategy } from "./local.strategy";


describe('local strategy', () => {
    let authService: any;
    let tokenService: any;
    let localStrategy: LocalStrategy;

    beforeEach(() => {
        authService = {
            validateUser: jest.fn(),
        };
        tokenService = {
        }
        localStrategy = new LocalStrategy(authService, tokenService)
    })

    it('should be defined', () => {
        expect(localStrategy).toBeDefined()
    })

    describe('validate', () => {
        it('should validate', async () => {
            const username = "username";
            const password = "password";

            const mockValidateUser = jest.fn().mockResolvedValue({email: username})
            authService.validateUser.mockImplementation(mockValidateUser)

            const result = await localStrategy.validate(username, password)

            expect(mockValidateUser).toHaveBeenCalledWith(username, password)

            expect(result).toEqual({email: username})
        })

        it('should not validate', async () => {
            const username = "username";
            const password = "password";

            const mockValidateUser = jest.fn().mockResolvedValue(null)
            authService.validateUser.mockImplementation(mockValidateUser)

            await expect(localStrategy.validate(username, password)).rejects.toThrow(BadRequestException)

            expect(mockValidateUser).toHaveBeenCalledWith(username, password)
        })
    })
})