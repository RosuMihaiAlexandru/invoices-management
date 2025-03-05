import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  async getInvoices(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const invoices = await this.prisma.invoice.findMany({
      skip,
      take: limit,
    });

    const totalInvoices = await this.prisma.invoice.count();

    return {
      data: invoices,
      page,
      limit,
      totalPages: Math.ceil(totalInvoices / limit),
      totalInvoices,
    };
  }

  async getInvoiceById(id: number) {
    return this.prisma.invoice.findUnique({
      where: { id },
    });
  }
}
