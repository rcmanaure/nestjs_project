import { Body, Controller, Get, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CodesI } from '../models/codes.interface';
import { CodeService } from '../service/codes.service';

@Controller('codes')
export class CodesController {
  constructor(private codesService: CodeService) {}

  @Post()
  add(@Body() codes: CodesI): Observable<CodesI> {
    return this.codesService.add(codes);
  }

  @Get()
  findAll(): Observable<CodesI[]> {
    return this.codesService.findAll();
  }
}
