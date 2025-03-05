import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller'; // Import controller
import { InvoiceService } from './invoice.service';
import { PrismaModule } from '../../prisma/prisma.module'; // Ensure correct path

@Module({
  imports: [PrismaModule], // Import PrismaModule so PrismaService is available
  controllers: [InvoiceController], // Register the controller
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class InvoiceModule {}
