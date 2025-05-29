import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as Excel from 'exceljs';
import { Upload } from './entities/upload.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/role.entity';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Upload)
    private uploadRepository: Repository<Upload>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async getUserFilesList(userId: string): Promise<Upload[]> {
    // Отдает список всех файлов для конкретного пользователя (результат загрузки пользователей)
    return this.uploadRepository.find({
      where: { uploadedBy: userId },
      select: ['id', 'fileName', 'status', 'createdAt', 'processedCount', 'errorCount'],
      order: { createdAt: 'DESC' }
    });
  }

  async processUserUploadFile(file: Express.Multer.File, userId: string) {
    if (!file) {
      throw new BadRequestException('Файл не найден');
    }

    // Загружаем и читаем Excel файл
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(file.buffer);
    const worksheet = workbook.getWorksheet(1);

    const errors: Array<{row: number, login: string, error: string}> = [];
    const successfulUsers: any[] = [];
    const existingRoles = await this.roleRepository.find();

    // Считать файл построчно и создать пользователей
    let rowNumber = 0;
    worksheet.eachRow({ includeEmpty: false }, async (row, index) => {
      if (index === 1) return; // Пропускаем заголовок
      
      rowNumber = index;
      try {
        const login = row.getCell(1).value?.toString().trim();
        const email = row.getCell(2).value?.toString().trim();
        const roleName = row.getCell(3).value?.toString().trim();
        const region = row.getCell(4).value?.toString().trim();
        const phone = row.getCell(5).value?.toString().trim();

        // Валидация данных
        if (!login) {
          errors.push({ row: rowNumber, login: login || '', error: 'Отсутствует логин' });
          return;
        }

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
          errors.push({ row: rowNumber, login, error: 'Некорректный email' });
          return;
        }

        // Проверка на повтор логинов
        const existingUser = await this.userRepository.findOne({ where: { login } });
        if (existingUser) {
          errors.push({ row: rowNumber, login, error: 'Логин уже существует' });
          return;
        }

        // Проверка существования роли
        const role = existingRoles.find(r => r.name === roleName);
        if (!role) {
          errors.push({ row: rowNumber, login, error: `Роль "${roleName}" не найдена` });
          return;
        }

        // Создаем пользователя
        const newUser = this.userRepository.create({
          login,
          email,
          role: role,
          region,
          phone,
          createdBy: userId
        });

        await this.userRepository.save(newUser);
        successfulUsers.push(newUser);

      } catch (error) {
        errors.push({ row: rowNumber, login: '', error: error.message });
      }
    });

    // Создаем Excel файл с ошибками (через exceljs красим в красный)
    const errorWorkbook = new Excel.Workbook();
    const errorSheet = errorWorkbook.addWorksheet('Ошибки валидации');
    
    // Заголовки
    const headerRow = errorSheet.addRow(['Строка', 'Логин', 'Ошибка']);
    headerRow.font = { bold: true };

    // Все ошибки с повтором логинов, отсутствием роли и т д в аналогичный эксель кладем
    errors.forEach(error => {
      const errorRow = errorSheet.addRow([error.row, error.login, error.error]);
      // через exceljs красим в красный
      errorRow.eachCell(cell => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFF0000' }
        };
        cell.font = { color: { argb: 'FFFFFFFF' } };
      });
    });

    // Автоширина колонок
    errorSheet.columns.forEach(column => {
      column.width = 20;
    });

    const buffer = await errorWorkbook.xlsx.writeBuffer();
    const base64Data = buffer.toString('base64');

    // Создаем в некоторой БД, в некоторой таблице запись и кладем base64 от файла в неё
    const uploadRecord = await this.uploadRepository.save({
      fileName: `errors_${file.originalname}`,
      originalFileName: file.originalname,
      fileData: base64Data,
      status: 'processed',
      uploadedBy: userId,
      processedCount: successfulUsers.length,
      errorCount: errors.length,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    // отдаем id
    return uploadRecord;
  }

  async getErrorFileAndDelete(id: string) {
    const upload = await this.uploadRepository.findOne({ where: { id } });
    
    if (!upload) {
      throw new NotFoundException('Файл не найден');
    }

    const buffer = Buffer.from(upload.fileData, 'base64');
    
    // Удаляем файл после скачивания
    await this.uploadRepository.delete(id);
    
    return {
      buffer,
      fileName: upload.fileName
    };
  }
}
