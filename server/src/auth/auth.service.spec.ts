import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: vi.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: vi.fn().mockReturnValue('testToken'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate a user with correct credentials', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: hashedPassword,
    };

    prismaService.user.findUnique = vi.fn().mockResolvedValue(mockUser);

    const user = await service.validateUser(mockUser.email, 'password123');
    expect(user).toEqual({ id: 1, email: 'test@example.com' });
  });

  it('should return null for invalid credentials', async () => {
    prismaService.user.findUnique = vi.fn().mockResolvedValue(null);

    const user = await service.validateUser('invalid@example.com', 'wrongpassword');
    expect(user).toBeNull();
  });

  it('should generate a JWT token', async () => {
    const user = { id: 1, email: 'test@example.com' };
    const token = await service.login(user);
    expect(token).toEqual({ access_token: 'testToken' });
  });
});
