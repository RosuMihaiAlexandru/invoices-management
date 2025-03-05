import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { PrismaService } from '../../prisma/prisma.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: PrismaService,
          useValue: {
            invoice: {
              findMany: vi.fn(),
              findUnique: vi.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch all invoices', async () => {
    const mockInvoices = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      vendor_name: `Vendor ${i + 1}`,
      amount: (Math.random() * (1000 - 100) + 100).toFixed(2),
      paid: i % 2 === 0, // Alternate between paid/unpaid
      due_date: new Date().toISOString(),
      description: `Invoice ${i + 1}`,
      user_id: 1,
    }));

    prismaService.invoice.findMany = vi.fn().mockResolvedValue(mockInvoices);

    const invoices = await service.getAllInvoices();
    expect(invoices).toHaveLength(50);
    expect(invoices[0].vendor_name).toBe('Vendor 1');
  });

  it('should fetch a specific invoice by ID', async () => {
    const mockInvoice = {
      id: 1,
      vendor_name: 'Vendor A',
      amount: 200.5,
      paid: false,
      due_date: new Date().toISOString(),
      description: 'Invoice A',
      user_id: 1,
    };

    prismaService.invoice.findUnique = vi.fn().mockResolvedValue(mockInvoice);

    const invoice = await service.getInvoiceById(1);
    expect(invoice).toBeDefined();
    expect(invoice.vendor_name).toBe('Vendor A');
  });
});
