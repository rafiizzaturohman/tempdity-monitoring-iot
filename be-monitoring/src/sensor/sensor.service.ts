import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SensorService {
  constructor(private prisma: PrismaService) {}

  // Sama seperti constructor Laravel (auto-create data)
  async ensureExists() {
    const count = await this.prisma.dht22.count();
    if (count === 0) {
      await this.prisma.dht22.create({
        data: {
          temperature: 0,
          humidity: 0,
        },
      });
    }
  }

  // Sama seperti getData()
  async getData() {
    await this.ensureExists();
    return this.prisma.dht22.findFirst();
  }

  // Sama seperti updateData($tmp, $hmd)
  async updateData(tmp: number, hmd: number) {
    await this.ensureExists();
    const record = await this.prisma.dht22.findFirst();

    await this.prisma.dht22.update({
      where: { id: record?.id },
      data: {
        temperature: tmp,
        humidity: hmd,
      },
    });

    return { message: 'Data updated successfully' };
  }
}
