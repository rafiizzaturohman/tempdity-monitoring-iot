import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SensorGateway } from './sensor/sensor.gateway';
import { SensorModule } from './sensor/sensor.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [SensorModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, SensorGateway, PrismaService],
})
export class AppModule {}
