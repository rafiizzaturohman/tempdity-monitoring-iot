import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { SensorService } from './sensor.service';

@Controller('sensor')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  // GET /sensor → Ambil data sensor
  @Get()
  async getData() {
    return this.sensorService.getData();
  }

  // POST /sensor/update → Update data sensor (dipakai NodeMCU)
  @Post('update')
  async updateData(@Body() body: any) {
    const t = Number(body.temperature);
    const h = Number(body.humidity);

    if (isNaN(t) || isNaN(h)) {
      throw new BadRequestException('Temperature and humidity must be numbers');
    }

    const result = await this.sensorService.updateData(t, h);

    return {
      success: true,
      ...result,
      received: { temperature: t, humidity: h },
    };
  }

  // POST /sensor/reset → Reset min/max ke nilai terbaru
  @Post('reset')
  async resetMinMax() {
    return this.sensorService.resetMinMax();
  }

  // POST /sensor/update-nmin → Update nilai minimum
  @Post('update-nmin')
  async updateMin(@Body() body: any) {
    console.log('REQ /update-nmin:', body); // DEBUG

    const { jenis_nilai, nilai } = body;

    if (!jenis_nilai || nilai === undefined || nilai === null) {
      throw new BadRequestException({
        success: false,
        message: 'jenis_nilai and nilai are required',
      });
    }

    const result = await this.sensorService.updateMin(
      jenis_nilai,
      Number(nilai),
    );

    return {
      success: true,
      message: 'Nilai minimum berhasil diperbarui',
      data: result,
    };
  }

  // POST /sensor/update-nmax → Update nilai maksimum
  @Post('update-nmax')
  async updateMax(@Body() body: any) {
    console.log('REQ /update-nmax:', body); // DEBUG

    const { jenis_nilai, nilai } = body;

    if (!jenis_nilai || nilai === undefined || nilai === null) {
      throw new BadRequestException({
        success: false,
        message: 'jenis_nilai and nilai are required',
      });
    }

    const result = await this.sensorService.updateMax(
      jenis_nilai,
      Number(nilai),
    );

    return {
      success: true,
      message: 'Nilai maksimum berhasil diperbarui',
      data: result,
    };
  }
}
