import { INestApplication, NotImplementedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from 'supertest';
import { DoesUserExist } from "../../core/guards/doesUserExist.guard";
import { UsersController } from "./users.controller";
import { usersProviders } from "./users.providers";
import { UsersService } from "./users.service";

describe('UserController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, ...usersProviders]
    }).compile()

    app = moduleFixture.createNestApplication();
    await app.init();
  })

  describe('/users/deleteByMail (DELETE)', () => {
    it('should delete a user', async () => {
      const testData = {
        email: "email2@test.com"
      }

      let usersInDb = [
        {
          name: 'user1',
          email: 'email1@test.com'
        },
        {
          name: 'user2',
          email: 'email2@test.com'
        },
        {
          name: 'user3',
          email: 'email3@test.com'
        }
      ]

      const testResult = 1

      const doesUserExist = app.get<DoesUserExist>(DoesUserExist);
      const mockValidateRequest = jest.fn().mockResolvedValue(true)
      doesUserExist.validateRequest = mockValidateRequest

      const userService = app.get<UsersService>(UsersService)
      const mockDelete = jest.fn().mockImplementation((emailToDelete) => {
        return new Promise((resolve: (value: number) => void, reject) => {
          let count: number = 0
          while (true) {
            const index = usersInDb.findIndex(({ name, email }) => email === emailToDelete)
            if (index < 0) {
              break;
            }
            count++;
            usersInDb.splice(index, 1)
          }
          resolve(count)
        })
      });
      userService.delete = mockDelete

      return request(app.getHttpServer())
        .delete('/users/deleteByMail')
        .send(testData)
        .expect(200)
        .then((response) => {
          expect(mockValidateRequest).toHaveBeenCalledWith(testData.email)
          expect(mockDelete).toHaveBeenCalledWith(testData.email)
          expect(mockDelete).toHaveLastReturnedWith(Promise.resolve(testResult))
        });
    })

    it('user does not exist', async () => {
      const testData = {
        email: "unknown@test.com"
      }

      let usersInDb = [
        {
          name: 'user1',
          email: 'email1@test.com'
        },
        {
          name: 'user2',
          email: 'email2@test.com'
        },
        {
          name: 'user3',
          email: 'email3@test.com'
        }
      ];

      const testResult = {
        "statusCode": 501,
        "message": "User unknown",
        "error": "Not Implemented"
      }

      const doesUserExist = app.get<DoesUserExist>(DoesUserExist);
      const mockValidateRequest = jest.fn().mockRejectedValue(new NotImplementedException('User unknown'))
      doesUserExist.validateRequest = mockValidateRequest

      const userService = app.get<UsersService>(UsersService)
      const mockDelete = jest.fn().mockResolvedValue(null)
      userService.delete = mockDelete

      return request(app.getHttpServer())
        .delete('/users/deleteByMail')
        .send(testData)
        .expect(501)
        .then((response) => {
          expect(response.body).toEqual(testResult)
          expect(mockValidateRequest).toHaveBeenCalledWith(testData.email)
          expect(mockDelete).not.toHaveBeenCalled()
        });
    })

    describe('/users/ (GET)', () => {
      it('should get all users', async () => {
        const usersInDb = [
          {
            name: 'user1',
            email: 'email1@test.com'
          },
          {
            name: 'user2',
            email: 'email2@test.com'
          },
          {
            name: 'user3',
            email: 'email3@test.com'
          }
        ];

        const userService = app.get<UsersService>(UsersService);
        const mockFindAll = jest.fn().mockResolvedValue(usersInDb)
        userService.findAll = mockFindAll

        return request(app.getHttpServer())
          .get('/users/')
          .expect(200)
          .then((response) => {
            expect(response.body).toEqual(usersInDb)
            expect(mockFindAll).toHaveBeenCalled()
          })
      })
    })
  })
})