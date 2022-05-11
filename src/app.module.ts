import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CodesModule } from './app/code.module';
import { UserModule } from './app/user.module';


@Module({
  imports: [
    // instalar para poder usar el process.env, npm i --save @nestjs/config
    ConfigModule.forRoot({ isGlobal: true }),
    // Para conectar a la base de datos, npm install --save @nestjs/typeorm typeorm pg
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    CodesModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
