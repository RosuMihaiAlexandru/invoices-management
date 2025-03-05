import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getInvoices(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    return this.invoiceService.getInvoices(pageNumber, limitNumber);
  }

  @Get(':id')
  async getInvoiceById(@Param('id') id: string) {
    return this.invoiceService.getInvoiceById(Number(id));
  }
}
