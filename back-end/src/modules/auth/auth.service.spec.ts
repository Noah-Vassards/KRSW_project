import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService: AuthService;
  let tokenService: any;
  let userService: any;
  let jwtService: any;
  let mailService: any;

  beforeEach(async () => {
    console.log('before Each')
    userService = {
      findOneByEmail: jest.fn(),
      findOneById: jest.fn(),
      create: jest.fn(),
    };
    tokenService = {
      findOneByUserId: jest.fn(),
      updateToken: jest.fn(),
      create: jest.fn(),
    };
    jwtService = {
      signAsync: jest.fn(),
    };
    mailService = {
      sendResetPassword: jest.fn(),
      sendConfirmPassword: jest.fn(),
    }
    authService = new AuthService(userService, tokenService, jwtService, mailService)
  });

  it('should be defined', () => {
    console.log('should be defined')
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate a user', async () => {
      console.log('should validate a user')
      const username = "test";
      const password = "password";

      const mockFindOneByEmail = jest.fn().mockResolvedValue({
        dataValues: {
          email: username,
          password: "mockpassword"
        }
      });

      userService.findOneByEmail.mockImplementation(mockFindOneByEmail)

      const mockedComparePassword = jest.fn().mockResolvedValue(true);
      authService['comparePassword'] = mockedComparePassword;

      const result = await authService.validateUser(username, password);

      expect(mockFindOneByEmail).toHaveBeenCalledWith(username);
      expect(mockedComparePassword).toHaveBeenCalledWith(password, 'mockpassword')

      expect(result).toEqual({
        email: username
      })
    })

    it('should not find user', async () => {
      console.log('should validate a user')
      const username = "test";
      const password = "password";

      const mockFindOneByEmail = jest.fn().mockResolvedValue(null);

      userService.findOneByEmail.mockImplementation(mockFindOneByEmail)

      const mockedComparePassword = jest.fn().mockResolvedValue(true);
      authService['comparePassword'] = mockedComparePassword;

      const result = await authService.validateUser(username, password);

      expect(mockFindOneByEmail).toHaveBeenCalledWith(username);
      expect(mockedComparePassword).not.toHaveBeenCalled()

      expect(result).toBeNull
    })

    it('should not match password', async () => {
      console.log('should validate a user')
      const username = "test";
      const password = "password";

      const mockFindOneByEmail = jest.fn().mockResolvedValue({
        dataValues: {
          email: username,
          password: "mockpassword"
        }
      });

      userService.findOneByEmail.mockImplementation(mockFindOneByEmail)

      const mockedComparePassword = jest.fn().mockResolvedValue(false);
      authService['comparePassword'] = mockedComparePassword;

      const result = await authService.validateUser(username, password);

      expect(mockFindOneByEmail).toHaveBeenCalledWith(username);
      expect(mockedComparePassword).toHaveBeenCalledWith(password, 'mockpassword')

      expect(result).toBeNull
    })
  })

  describe('login', () => {
    it('should login user - token updated with given token', async () => {
      const user: any = {
        id: 1,
        email: "test",
        password: 'password'
      }

      const userToken = {
        access_token: 'oldUserToken',
        expiration_date: new Date(),
      }
      userToken.expiration_date.setDate(userToken.expiration_date.getDate() - 7)

      const tokenInfo = {
        "access_token": "newAccessToken",
        "refresh_token": "newRefreshToken",
        "expires_in": 0
      }

      const mockedGenerateToken = jest.fn().mockResolvedValue('newGeneratedToken')
      authService['generateToken'] = mockedGenerateToken

      const mockedFindOneByUser = jest.fn().mockResolvedValue(userToken)
      tokenService['findOneByUserId'] = mockedFindOneByUser

      const mockedUpdateToken = jest.fn().mockResolvedValue('OK')
      tokenService['updateToken'] = mockedUpdateToken

      const result = await authService.login(user, tokenInfo)

      expect(mockedGenerateToken).not.toHaveBeenCalled()
      expect(mockedUpdateToken).toHaveBeenCalledWith(userToken, tokenInfo)

      expect(result).toEqual({
        user,
        token: 'newAccessToken'
      })
    })

    it('should login user - no token info in body', async () => {
      const user: any = {
        id: 1,
        email: "test",
        password: 'password'
      }

      const tokenInfo = {
        access_token: "newGeneratedToken",
        expires_in: 0,
        refresh_token: "",
      }

      const userToken = {
        access_token: 'oldUserToken',
        expiration_date: new Date(),
      }
      userToken.expiration_date.setDate(userToken.expiration_date.getDate() - 7)

      const mockedGenerateToken = jest.fn().mockResolvedValue('newGeneratedToken')
      authService['generateToken'] = mockedGenerateToken

      const mockedFindOneByUser = jest.fn().mockResolvedValue(userToken)
      tokenService['findOneByUserId'] = mockedFindOneByUser

      const mockedUpdateToken = jest.fn().mockResolvedValue('OK')
      tokenService['updateToken'] = mockedUpdateToken

      const result = await authService.login(user, undefined)

      expect(mockedGenerateToken).toHaveBeenCalledWith(user)
      expect(mockedUpdateToken).toHaveBeenCalledWith(userToken, tokenInfo)

      expect(result).toEqual({
        user,
        token: 'newGeneratedToken'
      })
    })

    it('should login user - token still up', async () => {
      const user: any = {
        id: 1,
        email: "test",
        password: 'password'
      }

      const tokenInfo = {
        access_token: "newGeneratedToken",
        expires_in: 0,
        refresh_token: "",
      }

      const userToken = {
        access_token: 'oldUserToken',
        expiration_date: new Date(),
      }
      userToken.expiration_date.setDate(userToken.expiration_date.getDate() + 7)

      const mockedGenerateToken = jest.fn().mockResolvedValue('newGeneratedToken')
      authService['generateToken'] = mockedGenerateToken

      const mockedFindOneByUser = jest.fn().mockResolvedValue(userToken)
      tokenService['findOneByUserId'] = mockedFindOneByUser

      const mockedUpdateToken = jest.fn().mockResolvedValue('OK')
      tokenService['updateToken'] = mockedUpdateToken

      const result = await authService.login(user, undefined)

      expect(mockedGenerateToken).not.toHaveBeenCalled()
      expect(mockedUpdateToken).not.toHaveBeenCalled()

      expect(result).toEqual({
        user,
        token: 'oldUserToken'
      })
    })
  })

  describe('resetPassword', () => {
    it('should send mail', async () => {
      const email = 'test';

      const mockFindOneByEmail = jest.fn().mockResolvedValue({
        dataValues: {
          email: email,
          password: "mockpassword"
        }
      });
      userService.findOneByEmail.mockImplementation(mockFindOneByEmail)

      const mockedGenerateToken = jest.fn().mockResolvedValue('token')
      authService['generateToken'] = mockedGenerateToken

      const mockedSendResetPassword = jest.fn().mockResolvedValue(true)
      mailService.sendResetPassword.mockImplementation(mockedSendResetPassword)

      await authService.resetPassword(email)

      expect(mockFindOneByEmail).toHaveBeenCalledWith(email)
      expect(mockedGenerateToken).toHaveBeenCalledWith({ email: email })
      expect(mockedSendResetPassword).toHaveBeenCalled()
    })

    it('should not send mail, user not found', async () => {
      const email = 'test';

      const mockFindOneByEmail = jest.fn().mockResolvedValue(null);
      userService.findOneByEmail.mockImplementation(mockFindOneByEmail)

      const mockedGenerateToken = jest.fn().mockResolvedValue('token')
      authService['generateToken'] = mockedGenerateToken

      const mockedSendResetPassword = jest.fn().mockResolvedValue(true)
      mailService.sendResetPassword.mockImplementation(mockedSendResetPassword)

      await authService.resetPassword(email)

      expect(mockFindOneByEmail).toHaveBeenCalledWith(email)
      expect(mockedGenerateToken).not.toHaveBeenCalled()
      expect(mockedSendResetPassword).not.toHaveBeenCalled()
    })
  })

  describe('resetPasswordFinal', () => {
    it('should send mail', async () => {
      const id = 10;
      const newPass = "newPassword"

      const mockFindOneById = jest.fn().mockResolvedValue({
        dataValues: {
          email: "test",
          password: "mockpassword",
        },
        save: () => { },
      });
      userService.findOneById.mockImplementation(mockFindOneById)

      const mockedHashPassword = jest.fn().mockResolvedValue('mockHashPassword')
      authService['hashPassword'] = mockedHashPassword

      const mockedGenerateToken = jest.fn().mockResolvedValue('token')
      authService['generateToken'] = mockedGenerateToken

      const mockedSendConfirmPassword = jest.fn().mockResolvedValue(true)
      mailService.sendConfirmPassword.mockImplementation(mockedSendConfirmPassword)

      await authService.resetPasswordFinal(id, newPass)

      expect(mockFindOneById).toHaveBeenCalledWith(id)
      expect(mockedHashPassword).toHaveBeenCalledWith(newPass)
      expect(mockedGenerateToken).toHaveBeenCalledWith({ email: "test" })
      expect(mockedSendConfirmPassword).toHaveBeenCalled()
    })

    it('should not send mail, user not found', async () => {
      const id = 10;
      const newPass = "newPassword"

      const mockFindOneById = jest.fn().mockResolvedValue(null);
      userService.findOneById.mockImplementation(mockFindOneById)

      const mockedHashPassword = jest.fn().mockResolvedValue('mockHashPassword')
      authService['hashPassword'] = mockedHashPassword

      const mockedGenerateToken = jest.fn().mockResolvedValue('token')
      authService['generateToken'] = mockedGenerateToken

      const mockedSendConfirmPassword = jest.fn().mockResolvedValue(true)
      mailService.sendConfirmPassword.mockImplementation(mockedSendConfirmPassword)

      await authService.resetPasswordFinal(id, newPass)

      expect(mockFindOneById).toHaveBeenCalledWith(id)
      expect(mockedHashPassword).not.toHaveBeenCalled()
      expect(mockedGenerateToken).not.toHaveBeenCalled()
      expect(mockedSendConfirmPassword).not.toHaveBeenCalled()
    })
  })
  describe('Create', () => {
    it('should insert user - no token infos in body', async () => {
      const user = {
        id: 1,
        name: "name",
        email: "email",
        password: "password",
      }

      const mockHashPassword = jest.fn().mockResolvedValue('mockHashPassword');
      authService['hashPassword'] = mockHashPassword;

      const mockCreateUser = jest.fn().mockResolvedValue({ dataValues: { ...user, password: 'mockHashPassword' } });
      userService.create.mockImplementation(mockCreateUser);

      const mockedGenerateToken = jest.fn().mockResolvedValue('token');
      authService['generateToken'] = mockedGenerateToken;

      const mockedCreateToken = jest.fn().mockResolvedValue('OK')
      tokenService['create'] = mockedCreateToken


      const result = await authService.create(user, undefined)

      let date = new Date();
      date.setDate(date.getDate() + 7)

      expect(mockHashPassword).toHaveBeenCalledWith(user.password)
      expect(mockedGenerateToken).toHaveBeenCalledWith({ id: user.id, name: user.name, email: user.email })
      expect(mockedCreateToken).toHaveBeenCalledWith({ access_token: 'token', expiration_date: expect.any(Date), refresh_token: "" }, user.id)

      expect(result).toEqual({ user: { id: 1, name: user.name, email: user.email }, token: "token" })
    })

    it('should insert user - token infos in body', async () => {
      const user = {
        id: 1,
        name: "name",
        email: "email",
        password: "password",
      }

      const tokenInfo = {
        "access_token": "providedToken",
        "refresh_token": "providedRefreshToken",
        "expires_in": 0
      }

      const mockHashPassword = jest.fn().mockResolvedValue('mockHashPassword');
      authService['hashPassword'] = mockHashPassword;

      const mockCreateUser = jest.fn().mockResolvedValue({ dataValues: { ...user, password: 'mockHashPassword' } });
      userService.create.mockImplementation(mockCreateUser);

      const mockedGenerateToken = jest.fn().mockResolvedValue('token');
      authService['generateToken'] = mockedGenerateToken;

      const mockedCreateToken = jest.fn().mockResolvedValue('OK')
      tokenService['create'] = mockedCreateToken


      const result = await authService.create(user, tokenInfo);

      let date = new Date();
      date.setDate(date.getDate() + 7)

      expect(mockHashPassword).toHaveBeenCalledWith(user.password)
      expect(mockedGenerateToken).not.toHaveBeenCalled();
      expect(mockedCreateToken).toHaveBeenCalledWith({ access_token: tokenInfo.access_token, expiration_date: expect.any(Date), refresh_token: tokenInfo.refresh_token }, user.id)

      expect(result).toEqual({ user: { id: 1, name: user.name, email: user.email }, token: "providedToken" })
    })
  })

  describe("hash password", () => {
    it('should hash the password', () => {
      const password = 'test'

      const result = authService['hashPassword'](password)

      expect(result).not.toEqual(password)
    })
  })

  describe("compare password", () => {
    it('should match passwords', async () => {
      const password = "password"
      const hash = await bcrypt.hash(password, 10)

      const result = await authService['comparePassword'](password, hash)

      expect(result).toBeTruthy();
    })

    it('should not match passwords', async () => {
      const password = "password"
      const hash = "wrong"

      const result = await authService['comparePassword'](password, hash)

      expect(result).toBeFalsy();
    })
  })

  describe("generate token", () => {
    it('should generate', async () => {
      const user = {
        email: "test",
        password: 'password'
      }

      const mockSignAsync = jest.fn().mockResolvedValue('mockedToken')
      jwtService.signAsync.mockImplementation(mockSignAsync)

      const result = await authService['generateToken'](user)

      expect(mockSignAsync).toHaveBeenCalledWith(user)

      expect(result).toBe('mockedToken');
    })
  })
});

