import { HttpModule, Module } from '@nestjs/common';
import { CodeService } from './service/codes.service';
import { CodesController } from './controller/codes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeEntity } from './models/codes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CodeEntity]), HttpModule],
  providers: [CodeService],
  controllers: [CodesController],
})
export class CodesModule {}
