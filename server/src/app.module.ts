import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { InvoiceModule } from './invoice/invoice.module';

@Module({
  imports: [AuthModule, InvoiceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
