import { UsersService } from "./users.service"

describe('UserService', () => {
    let userRepository: any
    let tokenService: any
    let usersService: UsersService

    beforeEach(async () => {
        userRepository = {
            create: jest.fn(),
            findOne: jest.fn(),
            findAll: jest.fn(),
            destroy: jest.fn(),
        };
        tokenService = {
            deleteByUserId: jest.fn()
        };
        usersService = new UsersService(userRepository, tokenService);
    })

    it('should be defined', () => {
        expect(usersService).toBeDefined()
    })

    describe('create', () => {
        it('should create a user', async () => {
            const user = {
                name: 'name',
                email: 'email',
                password: 'password',
            };

            const mockCreate = jest.fn().mockResolvedValue(user);
            userRepository.create.mockImplementation(mockCreate);

            const result = await usersService.create(user);

            expect(mockCreate).toHaveBeenCalledWith(user)

            expect(result).toEqual(user)
        })

        it('should not create a user', async () => {
            const user = {
                name: 'bad',
                email: 'bad',
                password: 'bad',
            };

            const mockCreate = jest.fn().mockResolvedValue(null);
            userRepository.create.mockImplementation(mockCreate);

            const result = await usersService.create(user);

            expect(mockCreate).toHaveBeenCalledWith(user)

            expect(result).toEqual(null)
        })
    })

    describe('findAll', () => {
        it('should find 1 user', async () => {
            const user = {
                name: 'name',
                email: 'email',
                password: 'password',
            };

            const mockedFindAll = jest.fn().mockResolvedValue(user)
            userRepository['findAll'] = mockedFindAll

            const result = await usersService.findAll()

            expect(mockedFindAll).toHaveBeenCalled()

            expect(result).toEqual(user)
        })

        it('should find many users', async () => {
            const user1 = {
                name: 'name1',
                email: 'email1',
                password: 'password1',
            };

            const user2 = {
                name: 'name2',
                email: 'email2',
                password: 'password2',
            };

            const user3 = {
                name: 'name3',
                email: 'email3',
                password: 'password3',
            };

            const mockedFindAll = jest.fn().mockResolvedValue([user1, user2, user3])
            userRepository['findAll'] = mockedFindAll

            const result = await usersService.findAll()

            expect(mockedFindAll).toHaveBeenCalled()

            expect(result).toEqual([user1, user2, user3])
        })

        it('should find no user', async () => {
            const mockedFindAll = jest.fn().mockResolvedValue([])
            userRepository['findAll'] = mockedFindAll

            const result = await usersService.findAll()

            expect(mockedFindAll).toHaveBeenCalled()

            expect(result).toEqual([])
        })
    })

    describe('findOneByEmail', () => {
        it('should find a user by email', async () => {
            const user = {
                name: 'name',
                email: 'email',
                password: 'password',
            };

            const mockFindOne = jest.fn().mockResolvedValue(user);
            userRepository.findOne.mockImplementation(mockFindOne);

            const result = await usersService.findOneByEmail('bad')

            expect(mockFindOne).toHaveBeenCalledWith({ where: { email: 'bad' } })

            expect(result).toEqual(user)
        })

        it('should not find a user by email', async () => {
            const user = {
                name: 'bad',
                email: 'bad',
                password: 'bad',
            };

            const mockFindOne = jest.fn().mockResolvedValue(null);
            userRepository.findOne.mockImplementation(mockFindOne);

            const result = await usersService.findOneByEmail("bad")

            expect(mockFindOne).toHaveBeenCalledWith({ where: { email: 'bad' } })

            expect(result).toEqual(null)
        })
    })

    describe('findOneById', () => {
        it('should find a user by id', async () => {
            const user = {
                name: 'name',
                email: 'email',
                password: 'password',
            };
            const id = 1;

            const mockFindOne = jest.fn().mockResolvedValue(user);
            userRepository.findOne.mockImplementation(mockFindOne);

            const result = await usersService.findOneById(id)

            expect(mockFindOne).toHaveBeenCalledWith({ where: { id: id } })

            expect(result).toEqual(user)
        })

        it('should not find a user by id', async () => {
            const user = {
                name: 'name',
                email: 'email',
                password: 'password',
            };
            const id = 1;

            const mockFindOne = jest.fn().mockResolvedValue(null);
            userRepository.findOne.mockImplementation(mockFindOne);

            const result = await usersService.findOneById(id)

            expect(mockFindOne).toHaveBeenCalledWith({ where: { id: id } })

            expect(result).toEqual(null)
        })
    })

    describe('delete', () => {
        it('should delete a user', async () => {
            const user = {
                'email': "email",
                'id': 1
            }

            const mockDestroy = jest.fn().mockResolvedValue(1)
            userRepository.destroy.mockImplementation(mockDestroy)

            const mockUserFindAll = jest.fn().mockResolvedValue([user])
            userRepository.findAll.mockImplementation(mockUserFindAll)

            const mockDeleteByUserId = jest.fn().mockResolvedValue(1)
            tokenService.deleteByUserId.mockImplementation(mockDeleteByUserId)

            const result = await usersService.delete(user.email)

            expect(mockDestroy).toHaveBeenCalledWith({ where: { email: user.email } })
            expect(mockUserFindAll).toHaveBeenCalledWith({ where: { email: user.email } })
            expect(mockDeleteByUserId).toHaveBeenCalledWith(user.id)

            expect(result).toBe(1)
        })

        it('should delete multiple user', async () => {
            const user = {
                'email': "email",
                'id': 1
            }

            const mockDestroy = jest.fn().mockResolvedValue(10)
            userRepository.destroy.mockImplementation(mockDestroy)

            const mockUserFindAll = jest.fn().mockResolvedValue([user])
            userRepository.findAll.mockImplementation(mockUserFindAll)

            const mockDeleteByUserId = jest.fn().mockResolvedValue(1)
            tokenService.deleteByUserId.mockImplementation(mockDeleteByUserId)

            const result = await usersService.delete(user.email)

            expect(mockDestroy).toHaveBeenCalledWith({ where: { email: user.email } })
            expect(mockUserFindAll).toHaveBeenCalledWith({ where: { email: user.email } })
            expect(mockDeleteByUserId).toHaveBeenCalledWith(user.id)

            expect(result).toBe(10)
        })

        it('should not delete user', async () => {
            const user = {
                'email': "email",
                'id': 1
            }

            const mockDestroy = jest.fn().mockResolvedValue(0)
            userRepository.destroy.mockImplementation(mockDestroy)

            const mockUserFindAll = jest.fn().mockResolvedValue([user])
            userRepository.findAll.mockImplementation(mockUserFindAll)

            const mockDeleteByUserId = jest.fn().mockResolvedValue(1)
            tokenService.deleteByUserId.mockImplementation(mockDeleteByUserId)

            const result = await usersService.delete(user.email)

            expect(mockDestroy).toHaveBeenCalledWith({ where: { email: user.email } })
            expect(mockUserFindAll).toHaveBeenCalledWith({ where: { email: user.email } })
            expect(mockDeleteByUserId).toHaveBeenCalledWith(user.id)

            expect(result).toBe(0)
        })
    })

    describe('deleteAll', () => {
        it('should delete all users', async () => {
            const users = [
                {
                    user_id: 1
                },
                {
                    user_id: 2
                },
                {
                    user_id: 3
                },
            ]

            const mockDestroy = jest.fn().mockResolvedValue(users.length)
            userRepository.destroy.mockImplementation(mockDestroy)

            const result = await usersService.deleteAll()

            expect(result).toEqual(users.length)
        })
    })
})