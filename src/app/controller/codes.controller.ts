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

  // Get all coords and nearest post codes.
  @Get('/coords')
  findAll(): Observable<CodesI[]> {
    return this.codesService.findAll();
  }

  // Get a random code.
  @Get('/random-code')
  getRandomCode(): any {
    return this.codesService.getRandomCode();
  }

  // Get all nearest postcodes and save it in the DB.
  @Get('/nearest-codes/:lon/:lat')
  getPostCodes(@Param() params: string): any {
    return this.codesService.getPostCodes(params);
  }

  // Get all nearest postcodes.
  @Get('/postcodes/:lon/:lat')
  getNearestCodes(@Param() params: string): any {
    return this.codesService.getNearestCodes(params);
  }

  // // Download file.
  // @Get('/file')
  // getCodes(): any {
  //   return this.codesService.getCodes();
  // }

  // Load CSV file to DB.
  @Get('/csv')
  loadCsv(): any {
    this.codesService.loadCsv();
    return 'Uploaded CSV file to DB';
  }
}
