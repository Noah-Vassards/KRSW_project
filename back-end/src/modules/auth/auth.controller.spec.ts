import { BadRequestException, INestApplication } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { DoesUserAlreadyExist, DoesUserExist } from '../../core/guards/doesUserExist.guard';
import { IsAutenticated } from '../../core/guards/isAuthenticated.guard';
import { ValidateInputPipe } from '../../core/pipes/validate.pipe';
import { MailModule } from '../mail/mail.module';
import { TokenModule } from '../token/token.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';

describe('AuthController', () => {
  let app: INestApplication;
  
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, TokenModule, JwtModule, MailModule],
      controllers: [AuthController],
      providers: [
        AuthService,
        LocalStrategy,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidateInputPipe());
    app.use(cookieParser())
    await app.init();
    jest.resetAllMocks()
  });

  describe('/account/login (POST)', () => {
    it('should succeed - token provided', async () => {
      const testData = {
        password: "testPassword",
        token: {
          access_token: "userAccessToken",
          expires_in: 0,
          refresh_token: "userRefreshToken"
        },
        email: "email"
      }

      const testResult = {
        user: {
          user_data: 'some data'
        },
        token: {
          token_data: 'some data'
        }
      }

      const localStrategy = app.get<LocalStrategy>(LocalStrategy);
      const mockValidate = jest.fn().mockResolvedValue({ user: 'user data' })
      localStrategy.validate = mockValidate

      const authService = app.get<AuthService>(AuthService);
      const mockLogin = jest.fn().mockResolvedValue(testResult);
      authService.login = mockLogin

      return request(app.getHttpServer())
        .post('/account/login')
        .send(testData)
        .expect(201)
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(response.body).toEqual(testResult);
          expect(mockValidate).toHaveBeenCalledWith(testData.email, testData.password, expect.any(Function));
          expect(mockLogin).toHaveBeenCalledWith({ user: 'user data' }, testData.token);
          // Add more assertions as needed
        });
    });

    it('should succeed - no token provided', async () => {
      const testData = {
        password: "testPassword",
        email: "email"
      }

      const testResult = {
        user: {
          user_data: 'some data'
        },
        token: {
          token_data: 'some data'
        }
      }

      const localStrategy = app.get<LocalStrategy>(LocalStrategy);
      const mockValidate = jest.fn().mockResolvedValue({ user: 'user data' })
      localStrategy.validate = mockValidate

      const authService = app.get<AuthService>(AuthService);
      const mockLogin = jest.fn().mockResolvedValue(testResult);
      authService.login = mockLogin

      return request(app.getHttpServer())
        .post('/account/login')
        .send(testData)
        .expect(201)
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(response.body).toEqual(testResult);
          expect(mockValidate).toHaveBeenCalledWith(testData.email, testData.password, expect.any(Function));
          expect(mockLogin).toHaveBeenCalledWith({ user: 'user data' }, undefined);
          // Add more assertions as needed
        });
    });

    it('should not know the user', async () => {
      const testData = {
        password: "testPassword",
        token: {
          access_token: "userAccessToken",
          expires_in: 0,
          refresh_token: "userRefreshToken"
        },
        email: "unknown email"
      }

      const testResult = {
        error: "Bad Request",
        message: 'Invalid user credentials',
        statusCode: 400
      }

      const localStrategy = app.get<LocalStrategy>(LocalStrategy);
      const mockValidate = jest.fn().mockImplementation(() => { throw new BadRequestException('Invalid user credentials'); });
      localStrategy.validate = mockValidate

      const authService = app.get<AuthService>(AuthService);
      const mockLogin = jest.fn().mockResolvedValue({})
      authService.login = mockLogin


      return request(app.getHttpServer())
        .post('/account/login')
        .send(testData)
        .expect(400)
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(response.body).toEqual(testResult);
          expect(mockValidate).toHaveBeenCalledWith(testData.email, testData.password, expect.any(Function));
          expect(mockLogin).not.toHaveBeenCalled();
          // Add more assertions as needed
        });
    });

    it('should not compute - no password provided', async () => {
      const testData = {
        body: {
          password: "password",
          token: {
            access_token: "userAccessToken",
            expires_in: 0,
            refresh_token: "userRefreshToken"
          },
        }
      }

      const testResult = {
        message: 'Unauthorized',
        statusCode: 401
      }

      const localStrategy = app.get<LocalStrategy>(LocalStrategy);
      const mockValidate = jest.fn().mockResolvedValue({});
      localStrategy.validate = mockValidate

      const authService = app.get<AuthService>(AuthService);
      const mockLogin = jest.fn().mockResolvedValue({})
      authService.login = mockLogin


      return request(app.getHttpServer())
        .post('/account/login')
        .send(testData)
        .expect(401)
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(response.body).toEqual(testResult);
          expect(mockValidate).not.toHaveBeenCalled();
          expect(mockLogin).not.toHaveBeenCalled();
          // Add more assertions as needed
        });
    })

    it('should not compute - no email provided', async () => {
      const testData = {
        password: "email",
        token: {
          access_token: "userAccessToken",
          expires_in: 0,
          refresh_token: "userRefreshToken"
        },
      }

      const testResult = {
        message: 'Unauthorized',
        statusCode: 401
      }

      const localStrategy = app.get<LocalStrategy>(LocalStrategy);
      const mockValidate = jest.fn().mockResolvedValue({});
      localStrategy.validate = mockValidate

      const authService = app.get<AuthService>(AuthService);
      const mockLogin = jest.fn().mockResolvedValue({})
      authService.login = mockLogin


      return request(app.getHttpServer())
        .post('/account/login')
        .send(testData)
        .expect(401)
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(response.body).toEqual(testResult);
          expect(mockValidate).not.toHaveBeenCalled();
          expect(mockLogin).not.toHaveBeenCalled();
          // Add more assertions as needed
        });
    })
  })

  describe('/account/signup (POST)', () => {
    it('should sign up user - token provided', async () => {
      const testData = {
        password: "testPassword1",
        name: 'testName',
        token: {
          access_token: "userAccessToken",
          expires_in: 0,
          refresh_token: "userRefreshToken"
        },
        email: "email@test.com"
      }

      const testResult = {
        user: {
          user_data: 'some data'
        },
        token: {
          token_data: 'some data'
        }
      }

      const doesUserAlreadyExist = app.get<DoesUserAlreadyExist>(DoesUserAlreadyExist);
      const mockValidate = jest.fn().mockResolvedValue(true)
      doesUserAlreadyExist.validateRequest = mockValidate

      const authService = app.get<AuthService>(AuthService);
      const mockCreate = jest.fn().mockResolvedValue(testResult);
      authService.create = mockCreate

      return request(app.getHttpServer())
        .post('/account/signup')
        .send(testData)
        .expect(201) // You can adjust the expected status code
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(response.body).toEqual(testResult)
          expect(mockValidate).toHaveBeenCalledWith(testData.email)
          expect(mockCreate).toHaveBeenCalledWith({ email: testData.email, password: testData.password, name: testData.name }, testData.token)
        });
    });

    it('should sign up user - token provided', async () => {
      const testData = {
        password: "testPassword1",
        name: 'testName',
        email: "email@test.com"
      }

      const testResult = {
        user: {
          user_data: 'some data'
        },
        token: {
          token_data: 'some data'
        }
      }

      const doesUserAlreadyExist = app.get<DoesUserAlreadyExist>(DoesUserAlreadyExist);
      const mockValidate = jest.fn().mockResolvedValue(true)
      doesUserAlreadyExist.validateRequest = mockValidate

      const authService = app.get<AuthService>(AuthService);
      const mockCreate = jest.fn().mockResolvedValue(testResult);
      authService.create = mockCreate

      return request(app.getHttpServer())
        .post('/account/signup')
        .send(testData)
        .expect(201) // You can adjust the expected status code
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(response.body).toEqual(testResult)
          expect(mockValidate).toHaveBeenCalledWith(testData.email)
          expect(mockCreate).toHaveBeenCalledWith({ email: testData.email, password: testData.password, name: testData.name }, undefined)
        });
    });

    it('should not sign up user - user already exists', async () => {
      const testData = {
        password: "testPassword1",
        name: 'testName',
        token: {
          access_token: "userAccessToken",
          expires_in: 0,
          refresh_token: "userRefreshToken"
        },
        email: "duplicateEmail@test.com"
      }

      const testResult = {
        error: "Bad Request",
        message: 'This email already exists',
        statusCode: 400
      }

      const doesUserAlreadyExist = app.get<DoesUserAlreadyExist>(DoesUserAlreadyExist);
      const mockValidate = jest.fn().mockImplementation(() => { throw new BadRequestException('This email already exists') })
      doesUserAlreadyExist.validateRequest = mockValidate

      const authService = app.get<AuthService>(AuthService);
      const mockCreate = jest.fn().mockResolvedValue(null);
      authService.create = mockCreate

      return request(app.getHttpServer())
        .post('/account/signup')
        .send(testData)
        .expect(400) // You can adjust the expected status code
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(response.body).toEqual(testResult)
          expect(mockValidate).toHaveBeenCalledWith(testData.email)
          expect(mockCreate).not.toHaveBeenCalled();
        });
    });

    it('should not sign up user - empty name', async () => {
      const testData = {
        password: "testPassword1",
        name: '',
        token: {
          access_token: "userAccessToken",
          expires_in: 0,
          refresh_token: "userRefreshToken"
        },
        email: "email@test.com"
      }

      const testResult = {
        error: "Bad Request",
        message: 'Bad user credentials',
        statusCode: 400
      }

      const doesUserAlreadyExist = app.get<DoesUserAlreadyExist>(DoesUserAlreadyExist);
      const mockValidate = jest.fn().mockResolvedValue(true)
      doesUserAlreadyExist.validateRequest = mockValidate

      const authService = app.get<AuthService>(AuthService);
      const mockCreate = jest.fn().mockResolvedValue(null);
      authService.create = mockCreate

      return request(app.getHttpServer())
        .post('/account/signup')
        .send(testData)
        .expect(400) // You can adjust the expected status code
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(response.body).toEqual(testResult)
          expect(mockValidate).toHaveBeenCalledWith(testData.email)
          expect(mockCreate).not.toHaveBeenCalled();
        });
    });

    it('should not sign up user - no name', async () => {
      const testData = {
        password: "testPassword1",
        token: {
          access_token: "userAccessToken",
          expires_in: 0,
          refresh_token: "userRefreshToken"
        },
        email: "email@test.com"
      }

      const testResult = {
        error: "Bad Request",
        message: 'Bad user credentials',
        statusCode: 400
      }

      const doesUserAlreadyExist = app.get<DoesUserAlreadyExist>(DoesUserAlreadyExist);
      const mockValidate = jest.fn().mockResolvedValue(true)
      doesUserAlreadyExist.validateRequest = mockValidate

      const authService = app.get<AuthService>(AuthService);
      const mockCreate = jest.fn().mockResolvedValue(null);
      authService.create = mockCreate

      return request(app.getHttpServer())
        .post('/account/signup')
        .send(testData)
        .expect(400) // You can adjust the expected status code
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(response.body).toEqual(testResult)
          expect(mockValidate).toHaveBeenCalledWith(testData.email)
          expect(mockCreate).not.toHaveBeenCalled();
        });
    });

    it('should not sign up user - no email', async () => {
      const testData = {
        password: "testPassword1",
        name: 'testName',
        token: {
          access_token: "userAccessToken",
          expires_in: 0,
          refresh_token: "userRefreshToken"
        }
      }

      const testResult = {
        error: "Bad Request",
        message: 'Bad user credentials',
        statusCode: 400
      }

      const doesUserAlreadyExist = app.get<DoesUserAlreadyExist>(DoesUserAlreadyExist);
      const mockValidate = jest.fn().mockResolvedValue(true)
      doesUserAlreadyExist.validateRequest = mockValidate

      const authService = app.get<AuthService>(AuthService);
      const mockCreate = jest.fn().mockResolvedValue(null);
      authService.create = mockCreate

      return request(app.getHttpServer())
        .post('/account/signup')
        .send(testData)
        .expect(400) // You can adjust the expected status code
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(response.body).toEqual(testResult)
          expect(mockValidate).toHaveBeenCalledWith(undefined)
          expect(mockCreate).not.toHaveBeenCalled();
        });
    });

    it('should not sign up user - empty email', async () => {
      const testData = {
        password: "testPassword1",
        name: 'testName',
        token: {
          access_token: "userAccessToken",
          expires_in: 0,
          refresh_token: "userRefreshToken"
        },
        email: ""
      }

      const testResult = {
        error: "Bad Request",
        message: 'Bad user credentials',
        statusCode: 400
      }

      const doesUserAlreadyExist = app.get<DoesUserAlreadyExist>(DoesUserAlreadyExist);
      const mockValidate = jest.fn().mockResolvedValue(true)
      doesUserAlreadyExist.validateRequest = mockValidate

      const authService = app.get<AuthService>(AuthService);
      const mockCreate = jest.fn().mockResolvedValue(null);
      authService.create = mockCreate

      return request(app.getHttpServer())
        .post('/account/signup')
        .send(testData)
        .expect(400) // You can adjust the expected status code
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(response.body).toEqual(testResult)
          expect(mockValidate).toHaveBeenCalledWith(testData.email)
          expect(mockCreate).not.toHaveBeenCalled();
        });
    });

    it('should not sign up user - not an email', async () => {
      const testData = {
        password: "testPassword1",
        name: 'testName',
        token: {
          access_token: "userAccessToken",
          expires_in: 0,
          refresh_token: "userRefreshToken"
        },
        email: "wrongEmailFormat"
      }

      const testResult = {
        error: "Bad Request",
        message: 'Bad user credentials',
        statusCode: 400
      }

      const doesUserAlreadyExist = app.get<DoesUserAlreadyExist>(DoesUserAlreadyExist);
      const mockValidate = jest.fn().mockResolvedValue(true)
      doesUserAlreadyExist.validateRequest = mockValidate

      const authService = app.get<AuthService>(AuthService);
      const mockCreate = jest.fn().mockResolvedValue(null);
      authService.create = mockCreate

      return request(app.getHttpServer())
        .post('/account/signup')
        .send(testData)
        .expect(400) // You can adjust the expected status code
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(response.body).toEqual(testResult)
          expect(mockValidate).toHaveBeenCalledWith(testData.email)
          expect(mockCreate).not.toHaveBeenCalled();
        });
    });

    it('should not sign up user - too short password', async () => {
      const testData = {
        password: "short1",
        name: 'testName',
        token: {
          access_token: "userAccessToken",
          expires_in: 0,
          refresh_token: "userRefreshToken"
        },
        email: "email@test.com"
      }

      const testResult = {
        error: "Bad Request",
        message: 'Bad user credentials',
        statusCode: 400
      }

      const doesUserAlreadyExist = app.get<DoesUserAlreadyExist>(DoesUserAlreadyExist);
      const mockValidate = jest.fn().mockResolvedValue(true)
      doesUserAlreadyExist.validateRequest = mockValidate

      const authService = app.get<AuthService>(AuthService);
      const mockCreate = jest.fn().mockResolvedValue(null);
      authService.create = mockCreate

      return request(app.getHttpServer())
        .post('/account/signup')
        .send(testData)
        .expect(400) // You can adjust the expected status code
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(response.body).toEqual(testResult)
          expect(mockValidate).toHaveBeenCalledWith(testData.email)
          expect(mockCreate).not.toHaveBeenCalled();
        });
    });

    it('should not sign up user - no digit in password', async () => {
      const testData = {
        password: "noDigitPassword",
        name: 'testName',
        token: {
          access_token: "userAccessToken",
          expires_in: 0,
          refresh_token: "userRefreshToken"
        },
        email: "testEmail"
      }

      const testResult = {
        error: "Bad Request",
        message: 'Bad user credentials',
        statusCode: 400
      }

      const doesUserAlreadyExist = app.get<DoesUserAlreadyExist>(DoesUserAlreadyExist);
      const mockValidate = jest.fn().mockResolvedValue(true)
      doesUserAlreadyExist.validateRequest = mockValidate

      const authService = app.get<AuthService>(AuthService);
      const mockCreate = jest.fn().mockResolvedValue(null);
      authService.create = mockCreate

      return request(app.getHttpServer())
        .post('/account/signup')
        .send(testData)
        .expect(400) // You can adjust the expected status code
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(response.body).toEqual(testResult)
          expect(mockValidate).toHaveBeenCalledWith(testData.email)
          expect(mockCreate).not.toHaveBeenCalled();
        });
    });

    it('should not sign up user - no character in password', async () => {
      const testData = {
        password: "12345678",
        name: 'testName',
        token: {
          access_token: "userAccessToken",
          expires_in: 0,
          refresh_token: "userRefreshToken"
        },
        email: "email@test.com"
      }

      const testResult = {
        error: "Bad Request",
        message: 'Bad user credentials',
        statusCode: 400
      }

      const doesUserAlreadyExist = app.get<DoesUserAlreadyExist>(DoesUserAlreadyExist);
      console.log(doesUserAlreadyExist.validateRequest.toString())
      const mockValidate = jest.fn().mockResolvedValue(true)
      doesUserAlreadyExist.validateRequest = mockValidate
      console.log(doesUserAlreadyExist.validateRequest.toString())
      console.log(doesUserAlreadyExist.validateRequest.call('test'))

      const authService = app.get<AuthService>(AuthService);
      const mockCreate = jest.fn().mockResolvedValue(null);
      authService.create = mockCreate

      const test = app.get<DoesUserAlreadyExist>(DoesUserAlreadyExist)
      console.log(test.validateRequest.toString())

      return request(app.getHttpServer())
        .post('/account/signup')
        .send(testData)
        .expect(400) // You can adjust the expected status code
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(response.body).toEqual(testResult)
          expect(mockValidate).toHaveBeenCalledWith(testData.email)
          expect(mockCreate).not.toHaveBeenCalled();
        });
    });
  })

  describe('/account/resetPassword (POST)', () => {
    it('should reset password', async () => {
      const testData = {
        email: "email@test.com",
        token: 'userToken'
      }

      const doesUserExist = app.get<DoesUserExist>(DoesUserExist)
      console.log(doesUserExist.validateRequest.toString())
      const mockDoesUserExist = jest.fn().mockResolvedValue(true)
      doesUserExist.validateRequest = jest.fn().mockImplementation(mockDoesUserExist)
      console.log(doesUserExist.validateRequest.toString())
      console.log(doesUserExist.validateRequest.call('test'))

      const isAuthenticated = app.get<IsAutenticated>(IsAutenticated)
      const mockIsAuthenticated = jest.fn().mockResolvedValue(true)
      isAuthenticated.validateRequest = jest.fn().mockImplementation(mockIsAuthenticated)

      const authService = app.get<AuthService>(AuthService)
      const mockResetPassword = jest.fn().mockResolvedValue(true)
      authService.resetPassword = jest.fn().mockImplementation(mockResetPassword)

      const test = app.get<DoesUserExist>(DoesUserExist)
      console.log(test.validateRequest.toString())

      return request(app.getHttpServer())
        .post('/account/resetPassword')
        .send({ email: testData.email })
        .set('Accept-Language', 'en')
        .set('Cookie', ['token=' + testData.token])
        .expect(201)
        .expect('Content-Type', /json/)
        .then(() => {
          expect(mockDoesUserExist).toHaveBeenCalledWith(testData.email)
          expect(mockIsAuthenticated).toHaveBeenCalled()
          expect(mockResetPassword).toHaveBeenCalledWith(testData.email)
        })
    })
  })
  afterEach(async () => {
    await app.close();
  });
});
