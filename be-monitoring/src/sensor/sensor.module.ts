import { Module } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { SensorController } from './sensor.controller';
import { SensorGateway } from './sensor.gateway';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SensorService, SensorGateway],
  controllers: [SensorController],
})
export class SensorModule {}
