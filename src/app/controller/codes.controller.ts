import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CodesI, PostCodesI } from '../models/codes.interface';
import { CodeService } from '../service/codes.service';

@Controller('codes')
export class CodesController {
  constructor(private codesService: CodeService) {}

  // Add post code.
  @Post('/add-code')
  add(@Body() codes: PostCodesI): Observable<PostCodesI> {
    return this.codesService.add(codes);
  }

  // Get all coords.
  @Get('/coords')
  findAll(): Observable<CodesI[]> {
    return this.codesService.findAll();
  }

  // Get a random code.
  @Get('/random-code')
  getRandomCode(): object {
    return this.codesService.getRandomCode();
  }

    // Get all coords.
    @Get('/postcodes/:lon/:lat')
    getPostCodes(@Param() params:string): object{
      return this.codesService.getPostCodes(params);
    }

  // Download file.
  @Get('/file')
  getCodes(): any {
    return this.codesService.getCodes();
  }

  // Load CSV file to DB.
  @Get('/csv')
  loadCsv(): any {
    return this.codesService.loadCsv();
  }
}
