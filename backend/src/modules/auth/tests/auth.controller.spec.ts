import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    refreshToken: jest.fn(),
    logout: jest.fn(),
    logoutAll: jest.fn(),
    requestPasswordReset: jest.fn(),
    resetPassword: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return token on successful login', async () => {
      // Arrange
      const loginDto = { email: 'test@example.com', password: 'password' };
      const mockToken = { accessToken: 'access-token', refreshToken: 'refresh-token' };
      mockAuthService.login.mockResolvedValue(mockToken);

      // Act
      const result = await controller.login(loginDto);

      // Assert
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockToken);
    });

    it('should throw UnauthorizedException on login failure', async () => {
      // Arrange
      const loginDto = { email: 'test@example.com', password: 'password' };
      mockAuthService.login.mockRejectedValue(new Error('Invalid credentials'));

      // Act & Assert
      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should return token on successful registration', async () => {
      // Arrange
      const registerDto = {
        username: 'test',
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      };
      const mockToken = { accessToken: 'access-token', refreshToken: 'refresh-token' };
      mockAuthService.register.mockResolvedValue(mockToken);

      // Act
      const result = await controller.register(registerDto);

      // Assert
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockToken);
    });

    it('should pass through ConflictException on duplicate user', async () => {
      // Arrange
      const registerDto = {
        username: 'test',
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      };
      mockAuthService.register.mockRejectedValue(new ConflictException('用户已存在'));

      // Act & Assert
      await expect(controller.register(registerDto)).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException on other registration errors', async () => {
      // Arrange
      const registerDto = {
        username: 'test',
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      };
      mockAuthService.register.mockRejectedValue(new Error('Registration error'));

      // Act & Assert
      await expect(controller.register(registerDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('refreshToken', () => {
    it('should return new token when refresh is successful', async () => {
      // Arrange
      const refreshTokenDto = { refreshToken: 'old-refresh-token' };
      const mockToken = { accessToken: 'new-access-token', refreshToken: 'new-refresh-token' };
      mockAuthService.refreshToken.mockResolvedValue(mockToken);

      // Act
      const result = await controller.refreshToken(refreshTokenDto);

      // Assert
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(refreshTokenDto);
      expect(result).toEqual(mockToken);
    });

    it('should throw UnauthorizedException when refresh fails', async () => {
      // Arrange
      const refreshTokenDto = { refreshToken: 'invalid-refresh-token' };
      mockAuthService.refreshToken.mockRejectedValue(new Error('Invalid refresh token'));

      // Act & Assert
      await expect(controller.refreshToken(refreshTokenDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should return success message on logout', async () => {
      // Arrange
      const req = { user: { id: 'user-id' } };
      const refreshToken = 'refresh-token';
      mockAuthService.logout.mockResolvedValue(undefined);

      // Act
      const result = await controller.logout(req as any, refreshToken);

      // Assert
      expect(mockAuthService.logout).toHaveBeenCalledWith('user-id', refreshToken);
      expect(result).toEqual({ message: '退出登录成功' });
    });

    it('should throw BadRequestException when no refresh token provided', async () => {
      // Arrange
      const req = { user: { id: 'user-id' } };

      // Act & Assert
      await expect(controller.logout(req as any, undefined as any)).rejects.toThrow(
        BadRequestException
      );
    });
  });
});
