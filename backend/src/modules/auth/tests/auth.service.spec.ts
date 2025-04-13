import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth.service';
import { UserService } from '../../user/services/user.service';
import { PrismaService } from '../../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let prismaService: PrismaService;

  const mockUser = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: 'USER',
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock.jwt.token'),
    verify: jest.fn().mockReturnValue({ sub: '1', username: 'testuser' }),
  };

  const mockUserService = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    findByUsername: jest.fn(),
    createUser: jest.fn(),
  };

  const mockPrismaService = {
    refreshToken: {
      create: jest.fn(),
      findFirst: jest.fn(),
      deleteMany: jest.fn(),
      delete: jest.fn(),
    },
    passwordReset: {
      create: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(callback => callback(mockPrismaService)),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        JWT_SECRET: 'test-secret',
        JWT_EXPIRES_IN: '1h',
        JWT_REFRESH_EXPIRES_IN: '7d',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    (bcrypt.compare as jest.Mock).mockImplementation((plaintext, hash) =>
      Promise.resolve(plaintext === 'correct_password')
    );

    (bcrypt.hash as jest.Mock).mockImplementation(() => Promise.resolve('newHashedPassword'));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should authenticate a user and return a token', async () => {
      // Arrange
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Act
      const result = await service.login({
        email: 'test@example.com',
        password: 'correct_password',
      });

      // Assert
      expect(mockUserService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(jwtService.sign).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw an error if user not found', async () => {
      // Arrange
      mockUserService.findByEmail.mockRejectedValue(new Error('用户不存在'));

      // Act & Assert
      await expect(
        service.login({ email: 'nonexistent@example.com', password: 'password' })
      ).rejects.toThrow('邮箱或密码错误');
    });

    it('should throw an error if password is incorrect', async () => {
      // Arrange
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(
        service.login({ email: 'test@example.com', password: 'wrong_password' })
      ).rejects.toThrow('邮箱或密码错误');
    });
  });

  describe('register', () => {
    it('should register a new user and return tokens', async () => {
      // Arrange
      const registerDto = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password',
        name: 'New User',
      };

      mockUserService.createUser.mockResolvedValue({
        id: '2',
        username: 'newuser',
        email: 'new@example.com',
        role: 'USER',
      });

      // Act
      const result = await service.register(registerDto);

      // Assert
      expect(mockUserService.createUser).toHaveBeenCalledWith(registerDto);
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });
});
