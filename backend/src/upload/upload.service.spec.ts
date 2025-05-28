// src/upload/upload.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as Excel from 'exceljs';
import { UploadService } from './upload.service';
import { Upload } from './entities/upload.entity';
import { User } from '../users/entities/user.entity';

describe('UploadService', () => {
  let service: UploadService;
  let uploadRepository: Repository<Upload>;
  let userRepository: Repository<User>;

  const mockUploadRepository = {
    find: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        {
          provide: getRepositoryToken(Upload),
          useValue: mockUploadRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
    uploadRepository = module.get<Repository<Upload>>(getRepositoryToken(Upload));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserFiles', () => {
    it('should return user files', async () => {
      const userId = 'test-user-id';
      const mockFiles = [
        { id: '1', userId, fileName: 'test.xlsx', status: 'processed' }
      ];

      mockUploadRepository.find.mockResolvedValue(mockFiles);

      const result = await service.getUserFiles(userId);

      expect(result).toEqual(mockFiles);
      expect(mockUploadRepository.find).toHaveBeenCalledWith({
        where: { userId },
        order: { createdAt: 'DESC' }
      });
    });
  });

  describe('processUploadFile', () => {
    it('should process file and create users successfully', async () => {
      const mockFile = {
        buffer: Buffer.from('test'),
        originalname: 'test.xlsx'
      } as Express.Multer.File;
      
      const userId = 'test-user-id';
      
      // Mock Excel processing
      const mockWorkbook = {
        xlsx: {
          load: jest.fn().mockResolvedValue(undefined)
        },
        getWorksheet: jest.fn().mockReturnValue({
          eachRow: jest.fn().mockImplementation((callback) => {
            // Simulate one valid row
            const mockRow = {
              getCell: jest.fn().mockImplementation((col) => ({
                value: col === 1 ? 'user@test.com' : 
                       col === 2 ? 'user@test.com' :
                       col === 3 ? 'user' : 'region'
              }))
            };
            callback(mockRow, 1);
          })
        })
      };

      jest.spyOn(Excel, 'Workbook').mockImplementation(() => mockWorkbook as any);

      const mockUpload = { id: 'upload-id' };
      mockUploadRepository.save.mockResolvedValue(mockUpload);
      mockUserRepository.findOne.mockResolvedValue(null); // User doesn't exist

      const result = await service.processUploadFile(mockFile, userId);

      expect(result).toEqual({ id: 'upload-id' });
      expect(mockUploadRepository.save).toHaveBeenCalled();
    });
  });
});
