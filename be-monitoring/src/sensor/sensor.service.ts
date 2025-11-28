import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SensorService {
  constructor(private prisma: PrismaService) {}

  // Pastikan 1 record selalu ada
  async ensureExists() {
    const count = await this.prisma.dht22.count();
    if (count === 0) {
      await this.prisma.dht22.create({
        data: {
          temperature: 0,
          humidity: 0,
          min_temperature: 0,
          max_temperature: 0,
          min_humidity: 0,
          max_humidity: 0,
        },
      });
    }
  }

  // Ambil data sensor
  async getData() {
    await this.ensureExists();
    return this.prisma.dht22.findFirst();
  }

  // Update nilai sensor + hitung min/max
  async updateData(tmp: number, hmd: number) {
    await this.ensureExists();
    const record = await this.prisma.dht22.findFirst();

    if (!record) return { message: 'Record not found' };

    const newMinTemp =
      record.min_temperature !== null
        ? Math.min(record.min_temperature, tmp)
        : tmp;

    const newMaxTemp =
      record.max_temperature !== null
        ? Math.max(record.max_temperature, tmp)
        : tmp;

    const newMinHum =
      record.min_humidity !== null ? Math.min(record.min_humidity, hmd) : hmd;

    const newMaxHum =
      record.max_humidity !== null ? Math.max(record.max_humidity, hmd) : hmd;

    await this.prisma.dht22.update({
      where: { id: record.id },
      data: {
        temperature: tmp,
        humidity: hmd,
        min_temperature: newMinTemp,
        max_temperature: newMaxTemp,
        min_humidity: newMinHum,
        max_humidity: newMaxHum,
      },
    });

    return { message: 'Data updated successfully' };
  }

  // Reset min/max ke nilai sensor saat ini
  async resetMinMax() {
    await this.ensureExists();
    const record = await this.prisma.dht22.findFirst();

    if (!record) return { message: 'Record not found' };

    await this.prisma.dht22.update({
      where: { id: record.id },
      data: {
        min_temperature: record.temperature,
        max_temperature: record.temperature,
        min_humidity: record.humidity,
        max_humidity: record.humidity,
      },
    });

    return { message: 'Min/Max reset' };
  }

  // Update manual MIN value
  async updateMin(field: string, value: number) {
    await this.ensureExists();
    const record = await this.prisma.dht22.findFirst();

    if (!record) return { message: 'Record not found' };

    if (!(field === 'min_temperature' || field === 'min_humidity')) {
      throw new Error('Invalid field for MIN update');
    }

    await this.prisma.dht22.update({
      where: { id: record.id },
      data: { [field]: value },
    });

    return { message: `${field} updated`, value };
  }

  // Update manual MAX value
  async updateMax(field: string, value: number) {
    await this.ensureExists();
    const record = await this.prisma.dht22.findFirst();

    if (!record) return { message: 'Record not found' };

    if (!(field === 'max_temperature' || field === 'max_humidity')) {
      throw new Error('Invalid field for MAX update');
    }

    await this.prisma.dht22.update({
      where: { id: record.id },
      data: { [field]: value },
    });

    return { message: `${field} updated`, value };
  }
}
