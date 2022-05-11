import { Module } from '@nestjs/common';
import { CodeService } from './service/codes.service';
import { CodesController } from './controller/codes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostCodeEntity } from './models/codes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostCodeEntity])],
  providers: [CodeService],
  controllers: [CodesController],
})
export class CodesModule {}
