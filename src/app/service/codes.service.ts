import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { CodeEntity } from '../models/codes.entity';
import { CodesI } from '../models/codes.interface';

@Injectable()
export class CodeService {
  constructor(
    @InjectRepository(CodeEntity)
    private codesRepository: Repository<CodeEntity>,
  ) {}

  add(codes: CodesI): Observable<CodesI> {
    return from(this.codesRepository.save(codes));
  }

  findAll(): Observable<CodesI[]> {
    return from(this.codesRepository.find());
  }
}
