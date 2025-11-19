import { Controller, Get, Param, Put } from '@nestjs/common';
import { SensorService } from './sensor.service';

@Controller('sensor')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Get()
  async getData() {
    return this.sensorService.getData();
  }

  @Get('update/:tmp/:hmd')
  async updateData(@Param('tmp') tmp: string, @Param('hmd') hmd: string) {
    return this.sensorService.updateData(Number(tmp), Number(hmd));
  }
}
