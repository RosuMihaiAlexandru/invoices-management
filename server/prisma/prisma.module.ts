import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Important: Export PrismaService so other modules can use it
})
export class PrismaModule {}
