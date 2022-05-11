import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/random-code')
  getRandomCode(): any {
    return this.appService.getRandomCode();
  }

  @Get('/file')
  getCodes(): any {
    return this.appService.getCodes();
  }

  @Post('/csv')
  loadCsv(): any {
    return this.appService.loadCsv();
  }
}





