// components/UserUpload.tsx
import React, { useState } from 'react';
import { Button, Upload, message, List, Card } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';

interface UploadFile {
  id: string;
  fileName: string;
  status: string;
  processedCount: number;
  errorCount: number;
  createdAt: string;
}

export const UserUploadComponent: React.FC = () => {
  const [uploads, setUploads] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  // FE Request -> get /api/admin/users/uploads -> Отображает список файлов пользователя
  const loadUserUploads = async () => {
    try {
      const response = await fetch('/api/admin/users/uploads');
      const data = await response.json();
      setUploads(data);
    } catch (error) {
      message.error('Ошибка загрузки списка файлов');
    }
  };

  // FE Request -> post /api/admin/users/upload -> FE Принять ссылку и отобразить в боковой панели
  const handleUpload = async (file: File) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/users/upload', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.uploadId) {
        message.success(result.message);
        // Отобразить ссылку на скачивание в боковой панели
        setUploads(prev => [...prev, {
          id: result.uploadId,
          fileName: file.name,
          status: 'processed',
          processedCount: 0,
          errorCount: 0,
          createdAt: new Date().toISOString()
        }]);
      }
    } catch (error) {
      message.error('Ошибка загрузки файла');
    } finally {
      setLoading(false);
    }
  };

  // FE клик по ссылке -> скачивание файла с ошибками
  const handleDownload = async (uploadId: string, fileName: string) => {
    try {
      const response = await fetch(`/api/admin/users/download/${uploadId}`);
      const blob = await response.blob();
      
      // Создаем ссылку для скачивания
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `errors_${fileName}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Обновляем список после скачивания (файл удален)
      setUploads(prev => prev.filter(upload => upload.id !== uploadId));
      message.success('Файл скачан и удален с сервера');
    } catch (error) {
      message.error('Ошибка скачивания файла');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, marginRight: 16 }}>
        <Upload.Dragger
          accept=".xlsx,.xls"
          beforeUpload={handleUpload}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />} loading={loading}>
            Загрузить файл пользователей
          </Button>
        </Upload.Dragger>
      </div>
      
      {/* Боковая панель со списком файлов */}
      <Card title="Загруженные файлы" style={{ width: 400 }}>
        <List
          dataSource={uploads}
          renderItem={(upload) => (
            <List.Item
              actions={[
                <Button 
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownload(upload.id, upload.fileName)}
                >
                  Скачать ошибки
                </Button>
              ]}
            >
              <List.Item.Meta
                title={upload.fileName}
                description={`Обработано: ${upload.processedCount}, Ошибок: ${upload.errorCount}`}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};
