// src/multifactor/multifactor.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MultifactorService } from './multifactor.service';

// Mock fetch
global.fetch = jest.fn();

describe('MultifactorService', () => {
  let service: MultifactorService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        MULTIFACTOR_API_KEY: 'test-api-key',
        MULTIFACTOR_API_SECRET: 'test-api-secret',
        MULTIFACTOR_CALLBACK_URL: 'http://localhost:3000/auth/multifactor/callback'
      };
      return config[key];
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MultifactorService,
        {
          provide: ConfigService,
          useValue: mockConfigService
        }
      ],
    }).compile();

    service = module.get<MultifactorService>(MultifactorService);
    configService = module.get<ConfigService>(ConfigService);

    // Clear all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccessRequest', () => {
    it('should create access request successfully', async () => {
      const mockResponse = {
        model: {
          id: 'test-id',
          url: 'https://access.multifactor.ru/test-id'
        },
        success: true,
        message: null
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse)
      });

      const result = await service.createAccessRequest('test@example.com');

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.multifactor.ru/access/requests',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Basic'),
            'Content-Type': 'application/json'
          })
        })
      );
    });

    it('should throw HttpException when API returns error', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      });

      await expect(
        service.createAccessRequest('test@example.com')
      ).rejects.toThrow(HttpException);
    });

    it('should throw HttpException when response success is false', async () => {
      const mockResponse = {
        model: null,
        success: false,
        message: 'Invalid request'
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse)
      });

      await expect(
        service.createAccessRequest('test@example.com')
      ).rejects.toThrow(HttpException);
    });
  });

  describe('getAccessHistory', () => {
    it('should get access history successfully', async () => {
      const mockResponse = {
        model: {
          data: [
            {
              id: 'test-id',
              identity: 'test@example.com',
              status: 'Granted',
              resourceName: 'Test Resource',
              createdAt: '2023-01-01T00:00:00Z',
              grantedAt: '2023-01-01T00:01:00Z',
              authenticator: 'Telegram',
              countryCode: 'RU',
              region: 'Moscow',
              city: 'Moscow',
              remoteHost: '192.168.1.1',
              ip: '192.168.1.1',
              twoFADeviceIp: '192.168.1.2'
            }
          ],
          offset: 0,
          limit: 10,
          totalElements: 1
        },
        success: true,
        message: null
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse)
      });

      const result = await service.getAccessHistory({
        createdAt: '2023-01-01'
      });

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.multifactor.ru/access/requests?createdAt=2023-01-01'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Basic')
          })
        })
      );
    });
  });
});
