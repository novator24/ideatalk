// src/multifactor/multifactor.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface MultifactorRequest {
  identity: string;
  email?: string;
  phone?: string;
  language?: 'ru' | 'en';
  claims?: Record<string, string>;
  callback: {
    action: string;
    target: '_self' | '_parent' | '_top';
  };
}

export interface MultifactorResponse {
  model: {
    id: string;
    url: string;
  };
  success: boolean;
  message: string | null;
}

export interface MultifactorHistoryRequest {
  createdAt: string;
  identity?: string;
  offset?: number;
  limit?: number;
}

export interface MultifactorHistoryResponse {
  model: {
    data: Array<{
      id: string;
      identity: string;
      status: string;
      resourceName: string;
      createdAt: string;
      grantedAt: string;
      authenticator: string;
      countryCode: string;
      region: string;
      city: string;
      remoteHost: string;
      ip: string;
      twoFADeviceIp: string;
    }>;
    offset: number;
    limit: number;
    totalElements: number;
  };
  success: boolean;
  message: string | null;
}

@Injectable()
export class MultifactorService {
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly callbackUrl: string;
  private readonly apiHost = 'https://api.multifactor.ru';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('MULTIFACTOR_API_KEY');
    this.apiSecret = this.configService.get<string>('MULTIFACTOR_API_SECRET');
    this.callbackUrl = this.configService.get<string>('MULTIFACTOR_CALLBACK_URL');

    if (!this.apiKey || !this.apiSecret || !this.callbackUrl) {
      throw new Error('Multifactor configuration is missing');
    }
  }

  async createAccessRequest(
    identity: string,
    email?: string,
    phone?: string,
    claims?: Record<string, string>,
    language: 'ru' | 'en' = 'ru'
  ): Promise<MultifactorResponse> {
    const request: MultifactorRequest = {
      identity,
      email,
      phone,
      language,
      claims,
      callback: {
        action: this.callbackUrl,
        target: '_self'
      }
    };

    try {
      const response = await fetch(`${this.apiHost}/access/requests`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${this.getBasicAuthHeader()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new HttpException(
          `Multifactor API error: ${response.statusText}`,
          response.status
        );
      }

      const data: MultifactorResponse = await response.json();
      
      if (!data.success) {
        throw new HttpException(
          `Multifactor request failed: ${data.message}`,
          HttpStatus.BAD_REQUEST
        );
      }

      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to create multifactor access request',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAccessHistory(params: MultifactorHistoryRequest): Promise<MultifactorHistoryResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('createdAt', params.createdAt);
    
    if (params.identity) {
      queryParams.append('identity', params.identity);
    }
    if (params.offset !== undefined) {
      queryParams.append('offset', params.offset.toString());
    }
    if (params.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }

    try {
      const response = await fetch(
        `${this.apiHost}/access/requests?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${this.getBasicAuthHeader()}`
          }
        }
      );

      if (!response.ok) {
        throw new HttpException(
          `Multifactor API error: ${response.statusText}`,
          response.status
        );
      }

      const data: MultifactorHistoryResponse = await response.json();
      
      if (!data.success) {
        throw new HttpException(
          `Multifactor request failed: ${data.message}`,
          HttpStatus.BAD_REQUEST
        );
      }

      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get multifactor access history',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private getBasicAuthHeader(): string {
    return Buffer.from(`${this.apiKey}:${this.apiSecret}`).toString('base64');
  }
}
