import { BadRequestException, ExecutionContext, NotImplementedException } from "@nestjs/common";
import { DoesUserAlreadyExist, DoesUserExist, DoesUserIdExist } from "./doesUserExist.guard";

describe('does user exist guard', () => {
    let userService: any

    beforeEach(() => {
        userService = {
            findOneByEmail: jest.fn(),
            findOneById: jest.fn(),
        };
    })
    describe('Does user already exist', () => {
        let doesUserAlreadyExist: DoesUserAlreadyExist;

        beforeEach(() => {
            doesUserAlreadyExist = new DoesUserAlreadyExist(userService);
        })

        it('should be defined', () => {
            expect(doesUserAlreadyExist).toBeDefined();
        })

        describe('can activate', () => {
            it('should activate', () => {
                const mockRequest = {
                    switchToHttp: jest.fn().mockReturnThis(),
                    getRequest: jest.fn().mockReturnValue({ /* Mock request object */ }),
                };
                const mockContext: ExecutionContext = {
                    switchToHttp: jest.fn().mockReturnValue(mockRequest),
                    getClass: jest.fn(),
                    getHandler: jest.fn(),
                    getArgs: jest.fn(),
                    getArgByIndex: jest.fn(),
                    switchToRpc: jest.fn(),
                    switchToWs: jest.fn(),
                    getType: jest.fn(),
                };

                const mockValidateRequest = jest.fn().mockReturnValue(true)
                doesUserAlreadyExist.validateRequest = mockValidateRequest

                expect(doesUserAlreadyExist.canActivate(mockContext)).toBeTruthy()

                expect(mockContext.switchToHttp).toHaveBeenCalled();
                expect(mockRequest.getRequest).toHaveBeenCalled();
            })

            it('should not activate - falsy', () => {
                const mockRequest = {
                    switchToHttp: jest.fn().mockReturnThis(),
                    getRequest: jest.fn().mockReturnValue({ /* Mock request object */ }),
                };
                const mockContext: ExecutionContext = {
                    switchToHttp: jest.fn().mockReturnValue(mockRequest),
                    getClass: jest.fn(),
                    getHandler: jest.fn(),
                    getArgs: jest.fn(),
                    getArgByIndex: jest.fn(),
                    switchToRpc: jest.fn(),
                    switchToWs: jest.fn(),
                    getType: jest.fn(),
                };

                const mockValidateRequest = jest.fn().mockReturnValue(false)
                doesUserAlreadyExist.validateRequest = mockValidateRequest

                expect(doesUserAlreadyExist.canActivate(mockContext)).toBeFalsy()

                expect(mockContext.switchToHttp).toHaveBeenCalled();
                expect(mockRequest.getRequest).toHaveBeenCalled();
            })

            it('should not activate - Exception', () => {
                const mockRequest = {
                    switchToHttp: jest.fn().mockReturnThis(),
                    getRequest: jest.fn().mockReturnValue({ /* Mock request object */ }),
                };
                const mockContext: ExecutionContext = {
                    switchToHttp: jest.fn().mockReturnValue(mockRequest),
                    getClass: jest.fn(),
                    getHandler: jest.fn(),
                    getArgs: jest.fn(),
                    getArgByIndex: jest.fn(),
                    switchToRpc: jest.fn(),
                    switchToWs: jest.fn(),
                    getType: jest.fn(),
                };

                const mockValidateRequest = jest.fn().mockResolvedValue(() => {
                    throw new Error('error')
                })
                doesUserAlreadyExist.validateRequest = mockValidateRequest

                try {
                    doesUserAlreadyExist.canActivate(mockContext)
                } catch (error) {
                    expect(error).toBe(new Error('error'))
                }

                expect(mockContext.switchToHttp).toHaveBeenCalled();
                expect(mockRequest.getRequest).toHaveBeenCalled();
            })
        })

        describe('validate Request', () => {
            it("should validate - user do not exists", async () => {
                const request = {
                    body: {
                        email: "email",
                    }
                };

                const mockFindOneByEmail = jest.fn().mockResolvedValue(null)
                userService.findOneByEmail.mockImplementation(mockFindOneByEmail)

                const result = await doesUserAlreadyExist.validateRequest(request.body.email)

                expect(mockFindOneByEmail).toHaveBeenCalledWith(request.body.email)

                expect(result).toBeTruthy()
            })

            it("should not validate - no email in body request", async () => {
                const request = {
                    body: {
                    }
                };

                const expectedError = new BadRequestException("No email address provided");

                const mockFindOneByEmail = jest.fn().mockResolvedValue({ user: "user" })
                userService.findOneByEmail.mockImplementation(mockFindOneByEmail)

                await expect(doesUserAlreadyExist.validateRequest(undefined)).rejects.toEqual(expectedError)

                expect(mockFindOneByEmail).not.toHaveBeenCalled()

            })

            it("should not validate - user already exists", async () => {
                const request = {
                    body: {
                        email: 'email',
                    }
                };

                const expectedError = new BadRequestException("This email already exists");

                const mockFindOneByEmail = jest.fn().mockResolvedValue({ user: "user" })
                userService.findOneByEmail.mockImplementation(mockFindOneByEmail)

                await expect(doesUserAlreadyExist.validateRequest(request.body.email)).rejects.toEqual(expectedError)

                expect(mockFindOneByEmail).toHaveBeenCalledWith(request.body.email)

            })
        })
    })

    describe('Does user exist', () => {
        let doesUserExist: DoesUserExist;

        beforeEach(() => {
            doesUserExist = new DoesUserExist(userService);
        })

        it('should be defined', () => {
            expect(doesUserExist).toBeDefined();
        })

        describe('can activate', () => {
            it('should activate', () => {
                const mockRequest = {
                    switchToHttp: jest.fn().mockReturnThis(),
                    getRequest: jest.fn().mockReturnValue({ /* Mock request object */ }),
                };
                const mockContext: ExecutionContext = {
                    switchToHttp: jest.fn().mockReturnValue(mockRequest),
                    getClass: jest.fn(),
                    getHandler: jest.fn(),
                    getArgs: jest.fn(),
                    getArgByIndex: jest.fn(),
                    switchToRpc: jest.fn(),
                    switchToWs: jest.fn(),
                    getType: jest.fn(),
                };

                const mockValidateRequest = jest.fn().mockReturnValue(true)
                doesUserExist.validateRequest = mockValidateRequest

                expect(doesUserExist.canActivate(mockContext)).toBeTruthy()

                expect(mockContext.switchToHttp).toHaveBeenCalled();
                expect(mockRequest.getRequest).toHaveBeenCalled();
            })

            it('should not activate - falsy', () => {
                const mockRequest = {
                    switchToHttp: jest.fn().mockReturnThis(),
                    getRequest: jest.fn().mockReturnValue({ /* Mock request object */ }),
                };
                const mockContext: ExecutionContext = {
                    switchToHttp: jest.fn().mockReturnValue(mockRequest),
                    getClass: jest.fn(),
                    getHandler: jest.fn(),
                    getArgs: jest.fn(),
                    getArgByIndex: jest.fn(),
                    switchToRpc: jest.fn(),
                    switchToWs: jest.fn(),
                    getType: jest.fn(),
                };

                const mockValidateRequest = jest.fn().mockReturnValue(false)
                doesUserExist.validateRequest = mockValidateRequest

                expect(doesUserExist.canActivate(mockContext)).toBeFalsy()

                expect(mockContext.switchToHttp).toHaveBeenCalled();
                expect(mockRequest.getRequest).toHaveBeenCalled();
            })

            it('should not activate - Exception', () => {
                const mockRequest = {
                    switchToHttp: jest.fn().mockReturnThis(),
                    getRequest: jest.fn().mockReturnValue({ /* Mock request object */ }),
                };
                const mockContext: ExecutionContext = {
                    switchToHttp: jest.fn().mockReturnValue(mockRequest),
                    getClass: jest.fn(),
                    getHandler: jest.fn(),
                    getArgs: jest.fn(),
                    getArgByIndex: jest.fn(),
                    switchToRpc: jest.fn(),
                    switchToWs: jest.fn(),
                    getType: jest.fn(),
                };

                const mockValidateRequest = jest.fn().mockResolvedValue(() => {
                    throw new Error('error')
                })
                doesUserExist.validateRequest = mockValidateRequest

                try {
                    doesUserExist.canActivate(mockContext)
                } catch (error) {
                    expect(error).toBe(new Error('error'))
                }

                expect(mockContext.switchToHttp).toHaveBeenCalled();
                expect(mockRequest.getRequest).toHaveBeenCalled();
            })
        })

        describe('validate Request', () => {
            it("should validate - user exists", async () => {
                const request = {
                    body: {
                        email: "email",
                    },
                    query: {
                        email: "email"
                    }
                };

                const mockFindOneByEmail = jest.fn().mockResolvedValue({ user: 'user' })
                userService.findOneByEmail.mockImplementation(mockFindOneByEmail)

                const result = await doesUserExist.validateRequest(request.body.email)

                expect(mockFindOneByEmail).toHaveBeenCalledWith(request.body.email)

                expect(result).toBeTruthy()
            })

            it("should validate - user exists - query", async () => {
                const request = {
                    body: {
                    },
                    query: {
                        email: "email"
                    }
                };

                const mockFindOneByEmail = jest.fn().mockResolvedValue({ user: 'user' })
                userService.findOneByEmail.mockImplementation(mockFindOneByEmail)

                const result = await doesUserExist.validateRequest(request.query.email)

                expect(mockFindOneByEmail).toHaveBeenCalledWith(request.query.email)

                expect(result).toBeTruthy()
            })

            it("should not validate - no email in request", async () => {
                const request = {
                    body: {
                    },
                    query: {

                    }
                };

                const expectedError = new NotImplementedException("No email address provided");

                const mockFindOneByEmail = jest.fn().mockResolvedValue({ user: "user" })
                userService.findOneByEmail.mockImplementation(mockFindOneByEmail)

                await expect(doesUserExist.validateRequest(undefined)).rejects.toEqual(expectedError)

                expect(mockFindOneByEmail).not.toHaveBeenCalled()

            })

            it("should not validate - user does not exists", async () => {
                const request = {
                    body: {
                        email: 'email',
                    },
                    query: {

                    }
                };

                const expectedError = new NotImplementedException("User unknown");

                const mockFindOneByEmail = jest.fn().mockResolvedValue(null)
                userService.findOneByEmail.mockImplementation(mockFindOneByEmail)

                await expect(doesUserExist.validateRequest(request.body.email)).rejects.toEqual(expectedError)

                expect(mockFindOneByEmail).toHaveBeenCalledWith(request.body.email)

            })
        })
    })

    describe('Does user exist', () => {
        let doesUserIdExist: DoesUserIdExist;

        beforeEach(() => {
            doesUserIdExist = new DoesUserIdExist(userService);
        })

        it('should be defined', () => {
            expect(doesUserIdExist).toBeDefined();
        })

        describe('can activate', () => {
            it('should activate', () => {
                const mockRequest = {
                    switchToHttp: jest.fn().mockReturnThis(),
                    getRequest: jest.fn().mockReturnValue({ /* Mock request object */ }),
                };
                const mockContext: ExecutionContext = {
                    switchToHttp: jest.fn().mockReturnValue(mockRequest),
                    getClass: jest.fn(),
                    getHandler: jest.fn(),
                    getArgs: jest.fn(),
                    getArgByIndex: jest.fn(),
                    switchToRpc: jest.fn(),
                    switchToWs: jest.fn(),
                    getType: jest.fn(),
                };

                const mockValidateRequest = jest.fn().mockReturnValue(true)
                doesUserIdExist.validateRequest = mockValidateRequest

                expect(doesUserIdExist.canActivate(mockContext)).toBeTruthy()

                expect(mockContext.switchToHttp).toHaveBeenCalled();
                expect(mockRequest.getRequest).toHaveBeenCalled();
            })

            it('should not activate - falsy', () => {
                const mockRequest = {
                    switchToHttp: jest.fn().mockReturnThis(),
                    getRequest: jest.fn().mockReturnValue({ /* Mock request object */ }),
                };
                const mockContext: ExecutionContext = {
                    switchToHttp: jest.fn().mockReturnValue(mockRequest),
                    getClass: jest.fn(),
                    getHandler: jest.fn(),
                    getArgs: jest.fn(),
                    getArgByIndex: jest.fn(),
                    switchToRpc: jest.fn(),
                    switchToWs: jest.fn(),
                    getType: jest.fn(),
                };

                const mockValidateRequest = jest.fn().mockReturnValue(false)
                doesUserIdExist.validateRequest = mockValidateRequest

                expect(doesUserIdExist.canActivate(mockContext)).toBeFalsy()

                expect(mockContext.switchToHttp).toHaveBeenCalled();
                expect(mockRequest.getRequest).toHaveBeenCalled();
            })

            it('should not activate - Exception', () => {
                const mockRequest = {
                    switchToHttp: jest.fn().mockReturnThis(),
                    getRequest: jest.fn().mockReturnValue({ /* Mock request object */ }),
                };
                const mockContext: ExecutionContext = {
                    switchToHttp: jest.fn().mockReturnValue(mockRequest),
                    getClass: jest.fn(),
                    getHandler: jest.fn(),
                    getArgs: jest.fn(),
                    getArgByIndex: jest.fn(),
                    switchToRpc: jest.fn(),
                    switchToWs: jest.fn(),
                    getType: jest.fn(),
                };

                const mockValidateRequest = jest.fn().mockResolvedValue(() => {
                    throw new Error('error')
                })
                doesUserIdExist.validateRequest = mockValidateRequest

                try {
                    doesUserIdExist.canActivate(mockContext)
                } catch (error) {
                    expect(error).toBe(new Error('error'))
                }

                expect(mockContext.switchToHttp).toHaveBeenCalled();
                expect(mockRequest.getRequest).toHaveBeenCalled();
            })
        })

        describe('validate Request', () => {
            it("should validate - user exists", async () => {
                const request = {
                    body: {
                        id: 1,
                    },
                };

                const mockFindOneById = jest.fn().mockResolvedValue({ user: 'user' })
                userService.findOneById.mockImplementation(mockFindOneById)

                const result = await doesUserIdExist.validateRequest(request.body.id)

                expect(mockFindOneById).toHaveBeenCalledWith(request.body.id)

                expect(result).toBeTruthy()
            })

            it("should not validate - no id in request", async () => {
                const request = {
                    body: {
                    },
                };

                const expectedError = new NotImplementedException("User id not provided");

                const mockFindOneById = jest.fn().mockResolvedValue({ user: "user" })
                userService.findOneById.mockImplementation(mockFindOneById)

                await expect(doesUserIdExist.validateRequest(undefined)).rejects.toEqual(expectedError)

                expect(mockFindOneById).not.toHaveBeenCalled()

            })

            it("should not validate - user does not exists", async () => {
                const request = {
                    body: {
                        id: 1,
                    },
                };

                const expectedError = new NotImplementedException("User unknown");

                const mockFindOneById = jest.fn().mockResolvedValue(null)
                userService.findOneById.mockImplementation(mockFindOneById)

                await expect(doesUserIdExist.validateRequest(request.body.id)).rejects.toEqual(expectedError)

                expect(mockFindOneById).toHaveBeenCalledWith(request.body.id)

            })
        })
    })
})