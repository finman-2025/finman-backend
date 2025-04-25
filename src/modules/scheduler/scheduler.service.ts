import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SchedulerService {
  constructor(private readonly httpService: HttpService) {}

  @Interval(14 * 60 * 1000)
  async callApi() {
    const url = process.env.BACKEND_URL;
    if (!url) return;

    try {
      await firstValueFrom(this.httpService.get(url));
    } catch (error) {
      console.error('Error recall:', error.message);
    }
  }
}
