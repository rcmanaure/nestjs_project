import { Controller, Get } from '@nestjs/common';
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
}
